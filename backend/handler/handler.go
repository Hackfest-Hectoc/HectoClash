package handler

import (
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/Hackfest-Hectoc/HectoClash/backend/models"
)

func Register(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	user := &models.User{
		Username: r.FormValue("username"),
		Email:    r.FormValue("email"),
		Password: r.FormValue("password"),
		Userid: uuid.New(),
	}
	log.Println(user)
}

func Login(w http.ResponseWriter, r *http.Request) {

}
