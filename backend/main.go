package main

import (
	"FuzzBuzz/backend/api"
	"FuzzBuzz/backend/stores"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Could not load .env")
		return
	}
	dataStore := stores.NewDataStore()
	port := os.Getenv("PORT")
	log.Fatal(api.NewServer("127.0.0.1:"+port, dataStore).ListenAndServe())
}
