package handler

import (
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/Hackfest-Hectoc/HectoClash/backend/database"
)

func Register(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		JSONResponse(w, http.StatusBadRequest, ErrBadFormData)
		return
	}

	var user User
	user.Username = strings.TrimSpace(r.FormValue("username"))
	user.Password = r.FormValue("password")
	user.Email = strings.ToLower(strings.TrimSpace(r.FormValue("email")))

	if validationErr, ok := validate(user); !ok {
		JSONResponse(w, http.StatusBadRequest, validationErr)
		return
	}

	if check := database.Register(user.Username, user.Password, user.Email); !check {
		JSONResponse(w, http.StatusInternalServerError, ErrRegFailure)
		return
	}

	log.Printf("USER: %s REGISTERED\n", user.Username)
	JSONResponse(w, http.StatusCreated, RegSuccess)
}

func Login(w http.ResponseWriter, r *http.Request) {
	var user User
	user.Username = r.FormValue("username")
	user.Password = r.FormValue("password")
	user.Email = r.FormValue("email")
	if len(user.Email) > 0 {
		user.Username = ""
	}

	uid, verifyUser := database.Verify(user.Username, user.Email, user.Password)
	if !verifyUser {
		JSONResponse(w, http.StatusUnauthorized, ErrInvalidCreds)
		return
	}

	jwtString, err := createToken(uid)
	if err != nil {
		JSONResponse(w, http.StatusInternalServerError, ErrInLogin)
		return
	}

	log.Println(jwtString)
	cookie := http.Cookie{
		Name: "token",
		Value: jwtString,
		Expires: time.Now().Add(24 * time.Hour),
		HttpOnly: true,
		Secure: false,
		SameSite: http.SameSiteLaxMode,
		Path: "/api",
	}
	http.SetCookie(w, &cookie)
	JSONResponse(w, http.StatusOK, LoggedIn)
}
