package main

import (
	"context"
	"encoding/json"
	_ "encoding/json"
	"log"
	"math/rand"
	"strconv"
	"time"
	"math/rand"
	"strconv"
	"encoding/json"

	"github.com/Hackfest-Hectoc/HectoClash/match-making-service/models"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client
var ctx = context.TODO()

const (
	QUEUE_KEY = "matchmaking_queue"
)

func Connect() {
	rdb = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
}

func MatchMakingService() {
	for {
		count, err := rdb.ZCard(ctx, QUEUE_KEY).Result()
		if err != nil {
			log.Println("ERROR IN MATCHMAKING SERVICE!!", err)
			continue
		}
		if count > 1 {
			log.Println(count)
			log.Println(count)
			topTwo, err := rdb.ZPopMax(ctx, QUEUE_KEY, 2).Result()
			if err == redis.Nil {
				continue
			}
			if err != nil {
				log.Println("ERROR IN MATCHMAKING SERVICE!!", err)
				continue
			}
			var first string = topTwo[0].Member.(string)
			var second string = topTwo[1].Member.(string)
			var gid string = uuid.New().String()

			// If client does not use their gid within 60 seconds
			// they will automatically be removed from the database
			var gameState models.Game
			var GameClient models.GameClient
			var GameClient models.GameClient

			gameState.ID = gid
			gameState.Playerone = first
			gameState.Playertwo = second
			gameState.Status = "starting"
			gameState.Player1CurrRound = 1
			gameState.Player2CurrRound = 1
			gameState.Player1LastSubmission = time.Now().Unix()
			gameState.Player2LastSubmission = time.Now().Unix()
			gameState.Questions = GenerateHectoc(5)
			gameState.NoofRounds = 5
			GameClient.ID = gid
			GameClient.Playerone = first
			GameClient.Playertwo = second
			GameClient.Status = "starting"
			GameClient.Player1CurrRound = 1
			GameClient.Player2CurrRound = 1
			GameClient.NoofRounds = 5
			gamestatejson, _ := json.Marshal(gameState)
			gameclientjson, _ := json.Marshal(GameClient)


			rdb.Set(ctx, gid,gamestatejson, time.Minute*10)
			rdb.Set(ctx, gid+"gameclient", gameclientjson, time.Minute*10)
			rdb.Set(ctx, first, gid, time.Minute*10)
			rdb.Set(ctx, second, gid, time.Minute*10)


			log.Println("GID ", gid, "SET")
			log.Println("USERS: ", first, second, " RUNNING UNDER GID: ", gid)
		}
	}
}

func GenerateHectoc(count int) []string {
	rand.Seed(time.Now().UnixNano()) // Seed to ensure randomness
	var results []string
	for j:=0 ; j<count ; j++{
		var result string
		for i := 0; i < 6; i++ {
			digit := rand.Intn(9) + 1 // Random number between 1 and 9
			result += strconv.Itoa(digit)
		}
		results = append(results, result)
	}

	return results
}

func main() {
	Connect()
	log.Println("CONNECTION SUCCESSFULL")
	MatchMakingService()
}
