package api

import (
	"net/http"
)

type handleHealth struct{}

func (h handleHealth) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	writeJsonResponse(w, 200, []byte(`{"ready": true}`))
	return
}
