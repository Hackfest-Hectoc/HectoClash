package handler

import (
	_ "log"
	"net/http"

	_ "github.com/Hackfest-Hectoc/HectoClash/backend/database"
	_ "github.com/Hackfest-Hectoc/HectoClash/backend/models"
	_ "github.com/google/uuid"
)

func Register(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		JSONResponse(w, http.StatusBadRequest, ErrBadFormData)
		return
	}

	var user User
	user.Username = r.FormValue("username")
	user.Password = r.FormValue("password")
	user.Email = r.FormValue("email")

	if check := anyEmpty(user); check {
		JSONResponse(w, http.StatusBadRequest, ErrEmptyFields)
		return
	}

	if message, ok := validate(user); !ok {
		JSONResponse(w, http.StatusBadRequest, message)
		return
	}

	if check := database.Register(user.Username, user.Password, user.Email); !check {
		JSONResponse(w, http.StatusInternalServerError, ErrRegFailure)
		return
	}

	JSONResponse(w, http.StatusOK, RegSuccess)
}

func Login(w http.ResponseWriter, r *http.Request) {
	
}
