package api

import (
	"net/http"
)

func writeJsonResponse(w http.ResponseWriter, statusCode int, jsonBody []byte) {
	w.Header().Set("Content-Type", "application/json")

	w.WriteHeader(statusCode)
	w.Write(jsonBody)
}
