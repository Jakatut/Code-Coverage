package stores

import (
	"FuzzBuzz/backend/entities"
	"errors"
	"fmt"
)

// The datastore is an in-memory data storage device, similar to a db.
// It contains the repos uploaded via the repo api as well as the coverage loaded via the coverage api.
type RepositoryStore struct {
	Repo map[string]entities.Repository
}

// Create a repository record.
func (r *RepositoryStore) Create(repository entities.Repository) (entities.Repository, error) {
	if val, ok := r.Repo[repository.Name]; ok {
		return val, errors.New(fmt.Sprintf("The Repository '%s' already exists.", repository.Name))
	} else {
		r.Repo[repository.Name] = repository
		return repository, nil
	}
}

// Update a repository record.
func (r *RepositoryStore) Update(repository entities.Repository) (entities.Repository, error) {
	if _, ok := r.Repo[repository.Name]; !ok {
		return entities.Repository{}, errors.New(fmt.Sprintf("The Repository '%s' does not exist.", repository.Name))
	} else {
		r.Repo[repository.Name] = repository
		return repository, nil
	}
}

// Get a repository record.
func (r *RepositoryStore) Get(repository entities.Repository) (entities.Repository, error) {
	if _, ok := r.Repo[repository.Name]; !ok {
		return entities.Repository{}, errors.New(fmt.Sprintf("The Repository '%s' does not exist.", repository.Name))
	} else {
		return r.Repo[repository.Name], nil
	}
}

// Get all repository records.
func (r *RepositoryStore) GetAll(repository entities.Repository) (map[string]entities.Repository, error) {
	return r.Repo, nil
}
