package api

import (
	"FuzzBuzz/backend/entities"
	"FuzzBuzz/backend/stores"
	"net/http"

	"github.com/gorilla/mux"
)

type handleCoverageUpdate struct {
	datastore *stores.CoverageStore
}

// Coverage update, don't need
func (h handleCoverageUpdate) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var coverage entities.Coverage
	if err := coverage.JsonUnmarshal(r.Body); err == nil {
		writeJsonResponse(w, http.StatusBadRequest, nil)
	}

	// Attempt to update the coverage. If the coverage data is not found (by filePath and fuzzer version)
	// respond with an error.
	coverage, err := h.datastore.Get(coverage)
	if err != nil {
		writeJsonResponse(w, http.StatusNotFound, nil)
		return
	}

	// Respond with the updated data or failure.
	if json, err := coverage.JsonMarshal(); err != nil {
		writeJsonResponse(w, http.StatusInternalServerError, nil)
	} else {
		writeJsonResponse(w, http.StatusCreated, json)
	}
}

// Coverage get for file
type handleCoverageGet struct {
	coverageStore   *stores.CoverageStore
	repositoryStore *stores.RepositoryStore
}

func (h handleCoverageGet) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	name := vars["name"]
	path := r.URL.Query().Get("path")
	if len(path) < 1 {
		writeJsonResponse(w, http.StatusBadRequest, nil)
		return
	}

	// Aggregate all coverage data for the requested file.
	coverageQuery := entities.Coverage{FilePath: path}
	coverage, err := h.coverageStore.GetAll(coverageQuery)
	if err != nil {
		writeJsonResponse(w, http.StatusNotFound, nil)
		return
	}

	repositoryQuery := entities.Repository{Name: name}
	repo, err := h.repositoryStore.Get(repositoryQuery)
	coverage.CoveredPercentage = coverage.CalculateTotalCoverage(repo)
	coverage.UncoveredRanges = nil // Uncovered is not useful for the client.

	// Respond with the coverage data.
	if json, err := coverage.JsonMarshal(); err != nil {
		writeJsonResponse(w, http.StatusInternalServerError, nil)
	} else {
		writeJsonResponse(w, http.StatusCreated, json)
	}
}

// Data upload
type handleCoverageCreate struct {
	datastore *stores.CoverageStore
}

func (h handleCoverageCreate) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var coverage entities.Coverage
	var err error
	if err = coverage.JsonUnmarshal(r.Body); err == nil {
		writeJsonResponse(w, http.StatusBadRequest, nil)
		return
	}

	coverage, err = h.datastore.Create(coverage)
	if err != nil {
		writeJsonResponse(w, http.StatusInternalServerError, nil)
		return
	}
	if json, err := coverage.JsonMarshal(); err != nil {
		writeJsonResponse(w, http.StatusInternalServerError, nil)
	} else {
		writeJsonResponse(w, http.StatusCreated, json)
	}
}
