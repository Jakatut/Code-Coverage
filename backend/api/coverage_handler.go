package api

import (
	"FuzzBuzz/backend/entities"
	"FuzzBuzz/backend/stores"
	"net/http"

	"github.com/gorilla/mux"
)

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
		writeJsonResponse(w, http.StatusNotFound, []byte(err.Error()))
		return
	}

	repositoryQuery := entities.Repository{Name: name}
	repo, err := h.repositoryStore.Get(repositoryQuery)
	coverage.CoveredPercentage = coverage.CalculateTotalCoverage(repo)
	coverage.UncoveredRanges = nil // Uncovered is not useful for the client.

	// Respond with the coverage data.
	if json, err := coverage.JsonMarshal(); err != nil {
		writeJsonResponse(w, http.StatusInternalServerError, []byte(err.Error()))
	} else {
		writeJsonResponse(w, http.StatusOK, json)
	}
}

// Data upload
type handleCoverageCreate struct {
	datastore *stores.CoverageStore
}

func (h handleCoverageCreate) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var coverage entities.Coverage
	var err error
	if err = coverage.JsonUnmarshal(r.Body); err != nil {
		writeJsonResponse(w, http.StatusBadRequest, []byte(err.Error()))
		return
	}

	coverage, err = h.datastore.Create(coverage)
	if err != nil {
		writeJsonResponse(w, http.StatusInternalServerError, []byte(err.Error()))
		return
	}
	if json, err := coverage.JsonMarshal(); err != nil {
		writeJsonResponse(w, http.StatusInternalServerError, []byte(err.Error()))
	} else {
		writeJsonResponse(w, http.StatusCreated, json)
	}
}

type handleCoverageCreateBulk struct {
	datastore *stores.CoverageStore
}

func (h handleCoverageCreateBulk) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var bulkCoverage entities.BulkCoverage
	var err error
	if err = bulkCoverage.JsonUnmarshal(r.Body); err != nil {
		writeJsonResponse(w, http.StatusBadRequest, []byte(err.Error()))
		return
	}

	bulkCoverage, err = h.datastore.CreateBulk(bulkCoverage)
	if err != nil {
		writeJsonResponse(w, http.StatusInternalServerError, []byte(err.Error()))
		return
	}
	if json, err := bulkCoverage.JsonMarshal(); err != nil {
		writeJsonResponse(w, http.StatusInternalServerError, []byte(err.Error()))
	} else {
		writeJsonResponse(w, http.StatusCreated, json)
	}
}
