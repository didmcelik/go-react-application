package main

import (
	"log"
	"net/http"
	"os"

	"github.com/didmcelik/go-react-application/configs"
	"github.com/didmcelik/go-react-application/routes"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Origin", "Content-Type", "Accept"})
	originsOk := handlers.AllowedOrigins([]string{os.Getenv("ORIGIN_ALLOWED")})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS", "DELETE"})
	//run database
	configs.ConnectDB()

	routes.UserRoute(router)

	log.Fatal(http.ListenAndServe(":4000", handlers.CORS(originsOk, headersOk, methodsOk)(router)))
}
