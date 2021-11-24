package main

import (
	"FuzzBuzz/backend/api"
	"FuzzBuzz/backend/stores"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Could not load .env")
		return
	}
	dataStore := stores.NewDataStore()
	log.Fatal(api.NewServer("127.0.0.1:3001", dataStore).ListenAndServe())
}
