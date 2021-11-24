package entities

import (
	"encoding/json"
	"io"
	"sort"
	"strings"
)

type Coverage struct {
	FuzzerVersion     int64   `json:"version"`
	FilePath          string  `json:"filepath"`
	CoveredPercentage float32 `json:"covered_percentage"`
	CoveredRanges     []Range `json:"covered_ranges"`
	UncoveredRanges   []Range `json:"uncovered_ranges,omitempty"`
}

func (c *Coverage) JsonMarshal() ([]byte, error) {
	return json.Marshal(c)
}

func (c *Coverage) JsonUnmarshal(rc io.ReadCloser) error {
	return json.NewDecoder(rc).Decode(&c)
}

type BulkCoverage struct {
	Coverage []Coverage `json:"coverage"`
}

func (bc *BulkCoverage) JsonMarshal() ([]byte, error) {
	return json.Marshal(bc)
}

func (bc *BulkCoverage) JsonUnmarshal(rc io.ReadCloser) error {
	return json.NewDecoder(rc).Decode(&bc)
}

type RangeType int

const (
	COVERED   RangeType = 0
	UNCOVERED RangeType = 1
)

type Cursor struct {
	Row    int `json:"row"`
	Column int `json:"col"`
}

type Range struct {
	Start Cursor `json:"start"`
	End   Cursor `json:"end"`
}

func (r1 *Range) isStartSmallerOrEqual(r2 Range) bool {
	// If the r1 start is on a line before the r2 start, true.
	// If the r1 start is on the same row as the r2 start and r1's start column is before or the same as the r2 start column, true
	return r1.Start.Row < r2.Start.Row || r1.Start.Row == r2.Start.Row && r1.Start.Column <= r2.Start.Column
}

func (r1 *Range) isStartSmallerOrEqualToEnd(r2 Range) bool {
	// If the r1 end is on a line before the r2 start, true
	// If the r1 end is on the same line as r2 start and the r1's end column is before or the same as r2's start column, true.
	return r1.Start.Row < r2.End.Row || r1.Start.Row == r2.End.Row && r1.Start.Column <= r2.End.Column
}

func (r1 *Range) isEndGreaterOrEqual(r2 Range) bool {
	// If the r1 end is on a line after the r2 end, true
	// If the r1 end is on the same line as the r2 end and r1's end column is after or the same as the r2 end column, true.
	return r1.End.Row > r2.End.Row || r1.End.Row == r2.End.Row && r1.End.Column >= r2.End.Column
}

func (r1 *Range) isEndGreaterOrEqualToStart(r2 Range) bool {
	// If the r1 end is on a line before the r2 start, true
	// If the r1 end is on the same line as r2 start and the r1's end column is before or the same as r2's start column, true.
	return r1.End.Row < r2.Start.Row || r1.End.Row == r2.Start.Row && r1.End.Column <= r2.Start.Column
}

type SortByStartRow []Range

func (r SortByStartRow) Len() int           { return len(r) }
func (r SortByStartRow) Swap(i, j int)      { r[i], r[j] = r[j], r[i] }
func (r SortByStartRow) Less(i, j int) bool { return r[i].Start.Row < r[j].Start.Row }

// Calculated the coverage over a range.
func (c *Coverage) CalculateCoverage(start Cursor, end Cursor, repository Repository) float32 {
	contentLength := repository.GetFileSize(c.FilePath)
	content, err := repository.GetFileFromRepoStorage(c.FilePath)
	if err != nil {
		return 0
	}
	coverageLength := countCharactersInRange(content, Range{Start: start, End: end})
	return float32(coverageLength) / float32(contentLength)
}

// Calculates the total coverage within the covered ranges.
// Ranges are sorted and flattened. Characters within the ranges are counted
// and divided by the size of the file.
func (c *Coverage) CalculateTotalCoverage(repository Repository) float32 {
	contentLength := repository.GetFileSize(c.FilePath)
	content, err := repository.GetFileFromRepoStorage(c.FilePath)
	if err != nil || len(content) == 0 {
		return 0
	}

	coverageLength := 0
	for _, coverage := range flattenOverlappingRanges(c.CoveredRanges) {
		coverageLength = countCharactersInRange(content, Range{Start: coverage.Start, End: coverage.End})
	}

	return float32(coverageLength) / float32(contentLength)
}

// Helpers

// Count the number of characters
func countCharactersInRange(lines string, lineRange Range) int {
	var characterCount = 0
	// Count the characters starting at the first line in the range.
	rows := strings.SplitAfter(lines, "\n")
	for i := lineRange.Start.Row; i <= lineRange.End.Row; i++ {
		if i == lineRange.Start.Row && lineRange.Start.Row != lineRange.End.Row { // First row
			if isStartValidForLine(lineRange.Start.Column, rows[i]) {
				characterCount += len(rows[i][lineRange.Start.Column:])
			}
		} else if i == lineRange.End.Row { // Last row
			end := lineRange.End.Column
			if isEndValidForLine(end, rows[i]) {
				end = len(rows[i])
			}
			characterCount += len(rows[i][:end])
		} else { // Between start and end (every character is assumed to be covered, including whitespace.)
			characterCount += len(rows[i])
		}
	}

	return characterCount
}

func isStartValidForLine(start int, line string) bool {
	return start <= len(line)
}

func isEndValidForLine(end int, line string) bool {
	return end > len(line)
}

func sortRanges(ranges []Range) {
	sort.Sort(SortByStartRow(ranges))
}

// When looking at the coverage of every test on a file, there may be overlapping ranges
// that can be "flattened out", reducing the number of ranges needed to calculate coverage.
func flattenOverlappingRanges(ranges []Range) []Range {
	// Examples:
	//  '1': first range, '2': second range, '[': start of a range, ']': end of a range, '-': "code".
	//
	// ; The end of the 1st range and the start of the 2nd range fall within the start of the 1st range and
	// ; the end of the 2nd range.
	// -1[---------------------------         -1[---------------------------
	// -----2[--------------]1-------    =>   ------------------------------
	// -------------------------]2---         -------------------------]1---
	//
	// ;The 1st range contains the 2nd range.
	// -1[---------------------------         -1[---------------------------
	// -----------------2[-----------    =>   ------------------------------
	// -----]2--------------------]1-         ---------------------------]1-

	sortRanges(ranges)
	if len(ranges) <= 1 {
		return ranges
	}

	// Swap starts and/or ends in the case that our current range falls within the next range.
	currentIndex := 0
	for i := 1; i < len(ranges); i++ {
		next := ranges[i]
		current := ranges[currentIndex]
		if currentIndex == len(ranges) {
			break
		}

		// Check if the next range starts within the current one. If it is, remove it, stay on the current index
		// and restart the curent iteration.
		if current.isStartSmallerOrEqual(next) && current.isEndGreaterOrEqual(next) {
			ranges = append(ranges[:i], ranges[i+1:]...)
			i--
			continue
		}

		// Check if the next range starts before the end of the current one. If it does, swap end and start,
		// remove next and restart the current iteration.
		if current.isStartSmallerOrEqualToEnd(next) {
			current.End = next.End
			ranges[currentIndex] = current
			ranges = append(ranges[:i], ranges[i+1:]...)
			i--
			continue
		}

		if i == len(ranges)-1 {
			i = 1 + currentIndex
			currentIndex++
		}
	}

	return ranges
}
