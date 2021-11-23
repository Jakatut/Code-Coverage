package api

import (
	"FuzzBuzz/backend/entities"
	"FuzzBuzz/backend/stores"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

type handleRepositoryGet struct {
	datastore *stores.RepositoryStore
}

func (h handleRepositoryGet) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	query := entities.Repository{Name: vars["name"]}

	repo, err := h.datastore.Get(query)
	if err != nil {
		writeJsonResponse(w, http.StatusNotFound, []byte(err.Error()))
		return
	}
	path := r.URL.Query().Get("path")
	// If the path is provided for a specific file within the repo, try to get it.
	if len(path) > 1 {
		fmt.Print(path)
		lines, err := repo.GetFileFromRepoStorage(path)
		if err != nil {
			writeJsonResponse(w, http.StatusNotFound, []byte(err.Error()))
			return
		}
		repoItem := repo.SetFileLines(path, lines)
		fmt.Print(repoItem.Lines)
		if json, err := json.Marshal(repoItem); err != nil {
			writeJsonResponse(w, http.StatusInternalServerError, []byte(err.Error()))
		} else {
			writeJsonResponse(w, http.StatusOK, json)
		}
		return
	}

	if json, err := json.Marshal(repo); err != nil {
		writeJsonResponse(w, http.StatusInternalServerError, []byte(err.Error()))
	} else {
		writeJsonResponse(w, http.StatusOK, json)
	}
}

type handleRepositoryCreate struct {
	datastore *stores.RepositoryStore
}

func (h handleRepositoryCreate) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	newRepo := entities.Repository{}
	err := newRepo.JsonUnmarshal(r.Body)
	if err != nil {
		writeJsonResponse(w, http.StatusBadRequest, []byte(err.Error()))
		return
	}

	repo, err := h.datastore.Create(newRepo)
	if err != nil {
		writeJsonResponse(w, http.StatusConflict, []byte(err.Error()))
		return
	}

	if json, err := repo.JsonMarshal(); err != nil {
		writeJsonResponse(w, http.StatusInternalServerError, []byte(err.Error()))
	} else {
		writeJsonResponse(w, http.StatusCreated, json)
	}
}
