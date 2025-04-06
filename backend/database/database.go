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

func GetGamesMongo()([]models.Game, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := Games.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var games []models.Game
	if err = cursor.All(ctx, &games); err != nil {
		return nil, err
	}
	return games, nil

}
func GetprofilefromMongo(id string) *models.User{
	
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	var user models.User
	err := Users.FindOne(ctx, bson.M{"userid": id}).Decode(&user)
	if(err!=nil){
		log.Println(err)
	}
	return &user

}





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

func GetGamesWithWins(userID string) ([]models.GameAndWin, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{
		"$or": []bson.M{
			{"playerone": userID},
			{"playertwo": userID},
		},
	}

	cursor, err := Games.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var rawGames []bson.M
	if err := cursor.All(ctx, &rawGames); err != nil {
		return nil, err
	}

	var results []models.GameAndWin

	for _, game := range rawGames {
		playerOneID, _ := game["playerone"].(string)
		playerOneName, _ := game["player1name"].(string)
		playerTwoName, _ := game["player2name"].(string)
		winnerID, _ := game["winner"].(string)
		gid, _ := game["id"].(string)

		var opponentName string
		var win int

		if playerOneID == userID {
			opponentName = playerTwoName
		} else {
			opponentName = playerOneName
		}

		if winnerID == userID {
			win = 1
		} else {
			win = 0
		}

		results = append(results, models.GameAndWin{
			Opponent: opponentName,
			Win:      win,
			GID:      gid,
		})
	}

	return results, nil
}



func GetNoOfMatches(userID string) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var result struct {
		Games []interface{} `bson:"games"`
	}

	err := Users.FindOne(ctx, bson.M{"userid": userID}).Decode(&result)
	if err != nil {
		return 0, err
	}

	return len(result.Games), nil
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

func UpdateRatinginMongo(winner, loser *models.UserDetails) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Create time-stamped rating entries
	winnerRatingEntry := bson.M{
		"rating":    winner.Rating,
		"timestamp": time.Now(),
	}
	loserRatingEntry := bson.M{
		"rating":    loser.Rating,
		"timestamp": time.Now(),
	}

	// Update winner: push new rating to ratings array
	_, err := Users.UpdateOne(
		ctx,
		bson.M{"userid": winner.Userid},
		bson.M{"$push": bson.M{"ratings": winnerRatingEntry}},
	)
	if err != nil {
		log.Printf("Failed to update winner rating: %v", err)
	}

	// Update loser: push new rating to ratings array
	_, err = Users.UpdateOne(
		ctx,
		bson.M{"userid": loser.Userid},
		bson.M{"$push": bson.M{"ratings": loserRatingEntry}},
	)
	if err != nil {
		log.Printf("Failed to update loser rating: %v", err)
	}

	log.Println("Rating updates completed")
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
	log.Println(id)
	err := Users.FindOne(context.TODO(), filter).Decode(&user)
	if err!=nil{
		log.Println(err)
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
	var defaultRating models.RatingEntry
	defaultRating.Rating = 800
	defaultRating.Timestamp = time.Now().Unix()
	user.Userid = uuid.New().String()
	user.Ratings = append(user.Ratings, defaultRating)
	user.Rating =800
	user.TotalSolves =0
	user.TotalTime = 0
	user.WrongSolves = 0
	user.TotalWins = 0
	// user. = 0
	
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

func AddGameToPlayer( gid string,Game models.Game) {
	filter := bson.M{"userid": Game.Playerone}
	var data models.User
	err := Users.FindOne(context.TODO(), filter).Decode(&data)
	if err != nil {
		log.Println("Unable to find user ",Game.Playerone)
		log.Println(err)
	}
	data.Games = append(data.Games, gid)
	data.TotalSolves+=Game.Player1RightSolves
	data.WrongSolves+=Game.Player2WrongSolves
	if Game.Winner==Game.Playerone{
		data.TotalWins++
	}
	data.TotalTime+=Game.StartTime-Game.EndTime

	_, err = Users.UpdateOne(context.TODO(), filter, bson.M{"$set":bson.M{"games":data.Games}})
	if err != nil {
		log.Println(err)
	}


	filter = bson.M{"userid": Game.Playerone}
	var data2 models.User
	errr := Users.FindOne(context.TODO(), filter).Decode(&data2)
	if errr != nil {
		log.Println("Unable to find user ", Game.Playertwo)
		log.Println(errr)
	}
	data2.Games = append(data.Games, gid)
	data2.TotalSolves+=Game.Player1RightSolves
	data2.WrongSolves+=Game.Player2WrongSolves
	if Game.Winner==Game.Playerone{
		data2.TotalWins++
	}
	data2.TotalTime+=Game.StartTime-Game.EndTime

	_, err = Users.UpdateOne(context.TODO(), filter, bson.M{"$set":bson.M{"games":data2.Games}})
	if err != nil {
		log.Println(err)
	}
}



type custom struct {
	Player1name string `bson:"player1name" json:"player1name"`
	Player2name string `bson:"player2name" json:"player2name"`
	v any
}

func AddGameRecord(game *models.Game) {
	var user models.User
	Users.FindOne(context.TODO(), bson.M{"userid":game.Playerone}).Decode(&user)
	game.Player1name = user.Username
	Users.FindOne(context.TODO(), bson.M{"userid":game.Playertwo}).Decode(&user)
	game.Player2name = user.Username

	_, err := Games.InsertOne(context.TODO(), game)
	if err != nil {
		log.Println("Unable to add Game record to database...")
	}
}