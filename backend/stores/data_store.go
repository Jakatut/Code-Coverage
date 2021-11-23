package stores

import "FuzzBuzz/backend/entities"

// The datastore is an in-memory data storage device, similar to a db.
// It contains the repos uploaded via the repo api as well as the coverage loaded via the coverage api.
type DataStore struct {
	RepoStore     RepositoryStore
	CoverageStore CoverageStore
}

func NewDataStore() *DataStore {
	return &DataStore{
		RepoStore:     RepositoryStore{Repo: make(map[string]entities.Repository)},
		CoverageStore: CoverageStore{Coverage: make([]entities.Coverage, 0)},
	}
}
