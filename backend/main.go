package main

import (
	"log"
	"net/http"
	"time"

	"github.com/Hackfest-Hectoc/HectoClash/backend/database"
	"github.com/Hackfest-Hectoc/HectoClash/backend/routes"
	"github.com/gorilla/mux"
)

func main() {
	log.Println("Connecting to DB.")
	disconnect := database.Connect()
	defer disconnect()
	log.Println("Connected to DB.")
	log.Println("Starting Server...")
	r := mux.NewRouter()
	routes.SetupRoutes(r)
	srv := &http.Server{
		Handler: r,
		Addr:    "127.0.0.1:8000",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	log.Fatal(srv.ListenAndServe())
}
