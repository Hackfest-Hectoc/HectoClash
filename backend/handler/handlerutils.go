package handler

import (
	"encoding/json"
	"net/http"
	"net/mail"
	"time"

	"github.com/Hackfest-Hectoc/HectoClash/backend/config"
	"github.com/Hackfest-Hectoc/HectoClash/backend/database"
	"github.com/golang-jwt/jwt/v5"
)

// User struct to unpack username, password and email from request body.
type User struct {
	Username string
	Password string
	Email    string
}

// Helper function to send JSON Response.
func JSONResponse(w http.ResponseWriter, statusCode int, v any) {
	w.Header().Set("content-type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(v)
}

// Function to validate user input.
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

func createToken(uid string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"uid": uid,
			"exp": time.Now().Add(time.Hour * 24).Unix(),
		},
	)
	tokenString, err := token.SignedString([]byte(config.JWT_SECRET))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
