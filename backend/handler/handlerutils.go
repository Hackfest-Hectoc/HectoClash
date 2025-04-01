package handler

import (
	"encoding/json"
	"net/http"
	"net/mail"

	"github.com/Hackfest-Hectoc/HectoClash/backend/database"
)

type User struct {
	Username string
	Password string
	Email    string
}

func JSONResponse(w http.ResponseWriter, statusCode int, v any) {
	w.Header().Set("content-type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(v)
}

func validate(user User) (Response, bool) {
	if user.Username == "" || user.Email == "" || user.Password == "" {
		return ErrEmptyFields, false
	}
	if len(user.Username) > 20 || len(user.Username) < 4 {
		return ErrInvalidUsername, false
	} 
	if len(user.Password) < 8 || len(user.Password) > 72 {
		return ErrInvalidPassword, false
	}
	if _, err := mail.ParseAddress(user.Email); err != nil {
		return ErrInvalidEmail, false
	}
	if check := database.UserExists(user.Username); check {
		return ErrUserExists, false
	}
	if check := database.EmailExists(user.Email); check {
		return ErrEmailExists, false
	}
	return Response{}, true
}

func anyEmpty(user User) bool {
	if user.Username == "" || user.Email == "" || user.Password == "" {
		return true
	}
	return false 
}