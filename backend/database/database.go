package database

import (
	"context"
	"log"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"golang.org/x/crypto/bcrypt"

	"github.com/Hackfest-Hectoc/HectoClash/backend/config"
	"github.com/Hackfest-Hectoc/HectoClash/backend/models"
	"github.com/google/uuid"
)

var Client *mongo.Client
var DB *mongo.Database
var Users *mongo.Collection
var Games *mongo.Collection

func Connect() func() {
	Client, err := mongo.Connect(options.Client().ApplyURI(config.MONGO_URI))
	if err != nil {
		panic(err)
	}

	DB = Client.Database("test")
	Users = DB.Collection("users")
	Games = DB.Collection("games")
	return func() {
		if err := Client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}
}


func EmailExists(email string) bool {
	filter := bson.M{"email": email}
	count, _ := Users.CountDocuments(context.TODO(), filter)
	return count != 0

}

func UserExists(username string) bool {
	filter := bson.M{"username": username}
	count, _ := Users.CountDocuments(context.TODO(), filter)
	return count != 0
}

func Register(username, password, email string) bool {
	var user models.User
	user.Username = username
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return false
	}
	user.Password = string(hashedPassword)
	user.Email = email

	user.Userid = uuid.New().String()
	result, err := Users.InsertOne(context.TODO(), user)
	if err != nil {
		log.Println(err)
		return false
	}
	log.Println(result)
	return true
}

func Verify(username, email, password string) bool {
	var filter bson.M
	if username != "" {
		filter = bson.M{"username": username}
	} else {
		filter = bson.M{"email": email}
	}
	var user models.User
	if err := Users.FindOne(context.TODO(), filter).Decode(&user); err != nil {
		log.Printf("ERROR: Unable to fetch user with username %s\n", username)
		return false
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		log.Println(err)
		return false
	}
	log.Printf("LOG: User %s logged in\n", user.Username)
	return true
}
