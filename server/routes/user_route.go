package routes

import (
	"github.com/didmcelik/go-react-application/controllers"
	"github.com/gorilla/mux"
)

func UserRoute(router *mux.Router) {
	router.HandleFunc("/getAll", controllers.GetAllUser()).Methods("GET")
	router.HandleFunc("/get/{id}", controllers.GetAUser()).Methods("GET")
	router.HandleFunc("/create", controllers.CreateUser()).Methods("POST")
	router.HandleFunc("/update/{id}", controllers.EditAUser()).Methods("PUT")
	router.HandleFunc("/delete/{id}", controllers.DeleteAUser()).Methods("DELETE")

}
