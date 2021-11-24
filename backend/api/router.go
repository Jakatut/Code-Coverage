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
	corsHandler := handlers.CORS(handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}), handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS"}), handlers.AllowedOrigins([]string{"*"}))

	server := &http.Server{
		Handler: timeoutHandler(recoveryHandler(corsHandler(serverRouter))),
		Addr:    listenAddress,
	}

	return server
}

func NewRouter(dataStore *stores.DataStore) *mux.Router {

	serverRouter := mux.NewRouter()
	serverRouter.Use(mux.CORSMethodMiddleware(serverRouter))

	apiV1 := serverRouter.PathPrefix("/api/").Subrouter()
	apiV1.Handle("/repository", handleRepositoryCreate{&dataStore.RepoStore}).Methods("POST", "OPTIONS")
	apiV1.Handle("/repository", handleRepositoryGetAll{&dataStore.RepoStore}).Methods("GET", "OPTIONS")
	apiV1.Handle("/repository/{name}", handleRepositoryGet{&dataStore.RepoStore}).Methods("GET", "OPTIONS") /* Query params: path - The path of the file in the repository.*/
	apiV1.Handle("/repository/{name}/coverage", handleCoverageGet{&dataStore.CoverageStore, &dataStore.RepoStore}).Methods("GET", "OPTIONS")
	apiV1.Handle("/repository/{name}/bulkCoverage", handleCoverageCreateBulk{&dataStore.CoverageStore}).Methods("POST", "OPTIONS")
	apiV1.Handle("/repository/{name}/coverage", handleCoverageCreate{&dataStore.CoverageStore}).Methods("POST", "OPTIONS")

	return serverRouter
}
