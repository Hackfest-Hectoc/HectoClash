package database

import (
	"context"
	// "fmt"
	"log"
	"time"

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

func ReturnTop20() []*models.UserDetails {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    // Define sorting and limit options
    findOptions := options.Find()
    findOptions.SetSort(bson.D{{Key: "rating", Value: -1}})
    findOptions.SetLimit(20)
	
    cursor, err := Users.Find(ctx, bson.D{}, findOptions)
    if err != nil {
        log.Println("Error fetching top 20 users:", err)
        return nil
    }
    defer cursor.Close(ctx)

    var users []*models.UserDetails
    for cursor.Next(ctx) {
        var user models.UserDetails
        if err := cursor.Decode(&user); err != nil {
            log.Println("Error decoding user:", err)
            continue
        }
        users = append(users, &user)
    }

    if err := cursor.Err(); err != nil {
        log.Println("Cursor error:", err)
    }

    return users
}


func CreateLeaderBoardIndex(){

	indexModel := mongo.IndexModel{
        Keys: bson.D{
            {Key: "userid", Value: -1},    
            {Key: "username", Value: -1},   
            {Key: "rating", Value: -1}, 
        },
    }
	_ ,err := Users.Indexes().CreateOne(context.TODO(), indexModel)

	if err!=nil{
		log.Println("Could not create index")
		return
	}

}


func GetUserFromID(id string) models.UserDetails{
	var user models.UserDetails
	filter := bson.M{"userid": id}
	err := Users.FindOne(context.TODO(), filter).Decode(&user)

	if err!=nil{
		log.Println("Could not fetch user data from mongo OR user does not exist")
		return models.UserDetails{}
	}
	return user
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

func Register(user *models.User) bool {
	if hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost); err != nil {
		return false
	} else {
		user.Password = string(hashedPassword)
	}
	user.Userid = uuid.New().String()
	user.Rating = 800
	if _, err := Users.InsertOne(context.TODO(), user); err != nil {
		log.Println(err)
		return false
	}
	return true
}

func Verify(username, email, password string) (string, bool) {
	var filter bson.M
	if username != "" {
		filter = bson.M{"username": username}
	} else {
		filter = bson.M{"email": email}
	}
	var user models.User
	if err := Users.FindOne(context.TODO(), filter).Decode(&user); err != nil {
		log.Printf("ERROR: Unable to fetch user with username %s\n", username)
		return "", false
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		log.Println(err)
		return "", false
	}
	log.Printf("LOG: User %s logged in\n", user.Username)
	return user.Userid, true
}
