package entities

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"os"
)

type RepositoryItemType string
type FileLines [][]rune

const (
	DIRECTORY RepositoryItemType = "DIRECTORY"
	File      RepositoryItemType = "FILE"
)

type RepositoryItem struct {
	Id       int32            `json:"id"`
	Path     string           `json:"path"`
	ItemType string           `json:"type"`
	Children []RepositoryItem `json:"children"`
	Lines    string           `json:"content"`
}

type Repository struct {
	Name  string           `json:"name"`
	Items []RepositoryItem `json:"items"`
}

func (r Repository) JsonMarshal() ([]byte, error) {
	return json.Marshal(r)
}

func (r *Repository) JsonUnmarshal(rc io.ReadCloser) error {
	return json.NewDecoder(rc).Decode(r)
}

func (r *Repository) SetFileLines(filePath string, lines string) RepositoryItem {

	var repoItem RepositoryItem
	forEachItemIndexed(r.Items, func(item RepositoryItem, index int) {
		if item.Path == filePath {
			item.Lines = lines // Make sure we're actually changing the value outside of this. Kinda tired rn, unsure if necessary.
			repoItem = item
		}
	})

	return repoItem
}

func (r *Repository) GetFileSize(filePath string) int {
	content, err := r.GetFileFromRepoStorage(filePath)
	if err != nil {
		return 0
	}
	return len(content)
}

func forEachItem(items []RepositoryItem, callback func(item RepositoryItem)) {
	if len(items) == 0 {
		return
	}

	for _, item := range items {
		callback(item)
		forEachItem(item.Children, callback)
	}
}

func forEachItemIndexed(items []RepositoryItem, callback func(item RepositoryItem, index int)) {
	if len(items) == 0 {
		return
	}

	for i, item := range items {
		callback(item, i)
		forEachItemIndexed(item.Children, callback)
	}
}

// Gets a file from the repository storage.
func (r *Repository) GetFileFromRepoStorage(filePath string) (string, error) {
	repoDir := os.Getenv("REPOSITORY_DIRECTORY")
	content, err := ioutil.ReadFile(repoDir + filePath)
	return string(content), err
}
