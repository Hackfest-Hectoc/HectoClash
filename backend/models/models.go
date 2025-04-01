package models

type User struct {
	Username string `bson:"username"`
	Userid   string `bson:"userid"`
	Email    string `bson:"email"`
	Password string `bson:"password"`

}