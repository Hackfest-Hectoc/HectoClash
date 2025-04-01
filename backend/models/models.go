package models


import (
	"github.com/google/uuid"
)

type User struct {
	Username string `bson:"username"`
	Userid   uuid.UUID `bson:"userid"`
	Email    string `bson:"email"`
	Password string `bson:"password"`
}


