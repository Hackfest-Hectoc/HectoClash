package main

import (
	"context"
	"log"
	"time"

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

			gameState.ID = gid
			gameState.Playerone = first
			gameState.Playertwo = second
			gameState.Status = "starting"
			rdb.Set(ctx, first, gid, time.Minute*10)
			rdb.Set(ctx, second, gid, time.Minute*10)
			rdb.Set(ctx, gid, gameState, time.Minute*10)
			log.Println("GID ", gid, "SET")
			log.Println("USERS: ", first, second, " RUNNING UNDER GID: ", gid)
		}
	}
}

func main() {
	Connect()
	log.Println("CONNECTION SUCCESSFULL")
	MatchMakingService()
}
