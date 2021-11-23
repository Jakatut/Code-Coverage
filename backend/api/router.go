package api

import (
	"FuzzBuzz/backend/stores"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func timeoutHandler(dt time.Duration) func(h http.Handler) http.Handler {
	return func(h http.Handler) http.Handler {
		return http.TimeoutHandler(h, dt, "timeout")
	}
}

func NewServer(listenAddress string, dataStore *stores.DataStore) *http.Server {

	serverRouter := NewRouter(dataStore)
	serverRouter.Handle("/health", handleHealth{})
	recoveryHandler := handlers.RecoveryHandler(handlers.PrintRecoveryStack(true), handlers.RecoveryLogger(log.Default()))
	timeoutHandler := timeoutHandler(25 * time.Second)

	server := &http.Server{
		Handler: timeoutHandler(recoveryHandler(serverRouter)),
		Addr:    listenAddress,
	}

	return server
}

func NewRouter(dataStore *stores.DataStore) *mux.Router {

	serverRouter := mux.NewRouter()

	apiV1 := serverRouter.PathPrefix("/api/v1").Subrouter()
	apiV1.Handle("/repository", handleRepositoryCreate{&dataStore.RepoStore}).Methods("POST")
	apiV1.Handle("/repository/{name}", handleRepositoryGet{&dataStore.RepoStore}).Methods("GET") // Get repo and repo contents by path (optional)

	apiV1.Handle("/repository/{name}/coverage", handleCoverageGet{&dataStore.CoverageStore, &dataStore.RepoStore}).Methods("GET")
	apiV1.Handle("/repository/{name}/coverage", handleCoverageCreate{&dataStore.CoverageStore}).Methods("POST")
	apiV1.Handle("/repository/{name}/coverage", handleCoverageUpdate{&dataStore.CoverageStore}).Methods("PUT")

	return serverRouter
}
