package stores

import (
	"FuzzBuzz/backend/entities"
	"errors"
	"fmt"
)

// The CoverageStore is an in-memory data storage device, similar to a db.
// It contains the coverage data.
// Confroms to IDataStoreCrud
type CoverageStore struct {
	Coverage []entities.Coverage
}

// Appends a new coverage record to the store.
func (cs *CoverageStore) Create(coverage entities.Coverage) (entities.Coverage, error) {
	cs.Coverage = append(cs.Coverage, coverage)
	return coverage, nil
}

// Appends a new coverage record to the store.
func (cs *CoverageStore) CreateBulk(bulkCoverage entities.BulkCoverage) (entities.BulkCoverage, error) {
	cs.Coverage = append(cs.Coverage, bulkCoverage.Coverage...)
	return bulkCoverage, nil
}

// Get a coverage record from the store (by filePath and FuzzerVersion)
func (cs *CoverageStore) Get(coverage entities.Coverage) (entities.Coverage, error) {
	for _, c := range cs.Coverage {
		if c.FilePath == coverage.FilePath && coverage.FuzzerVersion == cs.getLastFuzzerVersion(coverage.FilePath) {
			return c, nil
		}
	}

	return entities.Coverage{}, errors.New(fmt.Sprintf("Could not find file by the name of %s", coverage.FilePath))
}

// Get a coverage record from the store containing all test data for a file.
func (cs *CoverageStore) GetAll(coverage entities.Coverage) (entities.Coverage, error) {
	totalCoverage := entities.Coverage{FilePath: coverage.FilePath}
	for _, c := range cs.Coverage {
		if c.FilePath == coverage.FilePath {
			totalCoverage.CoveredRanges = append(totalCoverage.CoveredRanges, c.CoveredRanges...)
			totalCoverage.UncoveredRanges = append(totalCoverage.UncoveredRanges, c.UncoveredRanges...)
		}
	}
	if len(totalCoverage.CoveredRanges) == 0 && len(totalCoverage.UncoveredRanges) == 0 {
		return entities.Coverage{}, errors.New(fmt.Sprintf("Could not find file by the name of %s, %v+", coverage.FilePath, totalCoverage))
	}

	totalCoverage.FuzzerVersion = cs.getLastFuzzerVersion(coverage.FilePath)
	return totalCoverage, nil
}

// Update a coverage re cord by filepath and fuzzer version
func (cs *CoverageStore) Update(updateCoverage entities.Coverage) (entities.Coverage, error) {
	for i, coverage := range cs.Coverage {
		if coverage.FilePath == updateCoverage.FilePath && coverage.FuzzerVersion == updateCoverage.FuzzerVersion {
			cs.Coverage[i] = updateCoverage
			return coverage, nil
		}
	}

	return entities.Coverage{}, errors.New(fmt.Sprintf("Could not find file by the name of %s with fuzzerVersion %d", updateCoverage.FilePath, updateCoverage.FuzzerVersion))
}

// get the last fuzzer version for the filePaths repositroy.
func (cs *CoverageStore) getLastFuzzerVersion(filePath string) int64 {
	var maxVersion int64 = 0
	// Get the "root/repo name" to search for a specific repo's fuzzer version
	for _, coverage := range cs.Coverage {
		if coverage.FuzzerVersion > maxVersion && coverage.FilePath == filePath {
			maxVersion = coverage.FuzzerVersion
		}
	}

	return maxVersion
}
