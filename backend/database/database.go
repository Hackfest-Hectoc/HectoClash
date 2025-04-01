package database

import (
	"context"
	"fmt"
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
	DB = Client.Database("TEST")
	Users = DB.Collection("users")
	Games = DB.Collection("games")
	return func() {
		if err := Client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}
}

// Modify all this

type UserRepository struct {
	Collection *mongo.Collection
}

func (r *UserRepository) InsertUser(users *models.User) (interface{}, error) {
	result, err := r.Collection.InsertOne(context.Background(), users)
	if err != nil {
		return nil, err
	}
	return result.InsertedID, nil
}

// func (r *UserRepository) FindEmployeeByID(empID string) (*models.User, error) {
// 	var user models.User
// 	err := r.Collection.FindOne(context.Background(), bson.M{"employee_id": empID}).Decode(&emp)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return &emp, nil
// }

func (r *UserRepository) FindAllUsers() ([]models.User, error) {
	results, err := r.Collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	var users []models.User
	if err = results.All(context.Background(), &users); err != nil {
		return nil, fmt.Errorf("results decode error: %s", err.Error())
	}
	return users, nil
}

func (r *UserRepository) UpdateUserByID(UseridID string, updateUser *models.User) (int64, error) {
	result, err := r.Collection.UpdateOne(context.Background(), bson.M{"userid": UseridID}, bson.M{"$set": updateUser})
	if err != nil {
		return 0, err
	}
	return result.ModifiedCount, nil
}

func (r *UserRepository) DeleteUserByID(Userid string) (int64, error) {
	result, err := r.Collection.DeleteOne(context.Background(), bson.M{"userid": Userid})
	if err != nil {
		return 0, err
	}
	return result.DeletedCount, nil
}

func EmailExists(email string) bool {
	filter := bson.M{"email": email}
	count, _ := Users.CountDocuments(context.TODO(), filter)
	if count != 0 {
		return true
	}
	return false
}

func UserExists(username string) bool {
	filter := bson.M{"username": username}
	count, _ := Users.CountDocuments(context.TODO(), filter)
	if count == 0 {
		return true
	}
	return false
}

func Register(username, password, email string) bool {
	var user models.User
	user.Username = username
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return false
	}
	user.Password = string(hashedPassword)
	user.Email = email
	user.Userid = uuid.New()
	result, err := Users.InsertOne(context.TODO(), user)
	if err != nil {
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
		log.Printf("ALERT: User %s tried to login with wrong password\n", username)
		return false
	}
	log.Printf("LOG: User %s logged in\n", username)
	return true
}
