package handler

import (
	"context"
	"encoding/json"
	"log"
	"time"
	"github.com/Hackfest-Hectoc/HectoClash/backend/models"
	"github.com/gofiber/contrib/websocket"
	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client
var ctx = context.TODO()

const (
	QUEUE_KEY = "matchmaking_queue"
)

type resp struct {
	Title   string `json:"title"`
	Message any    `json:"message"`
}

// type initializeGame struct {
// 	Title   string `json:"title"`
// 	message string `json:"message"`
// }

func UpdatedLeaderboardinRedis() {

		

}
func PublishMessage(gid string, message resp) error {
	msg, _ := json.Marshal(message)
	err := rdb.Publish(ctx, gid, msg).Err()
	if err != nil {
		return err
	}
	log.Println("Published message: ", message)
	return nil
}

func AddtoQueue(uid string) bool {

	// Add to Queue
	timeStamp := float64(time.Now().Unix())
	_, err := rdb.ZAdd(ctx, QUEUE_KEY, redis.Z{
		Score:  timeStamp,
		Member: uid,
	}).Result()

	if err != nil {
		log.Println("ERROR: Unable to add player to matchmaking queue.", err)
		return false
	}

	log.Printf("Player %s added to matchmaking queue.\n", uid)
	return true
}

func ReadKey(uid string) string {
	value, _ := rdb.Get(ctx, uid).Result()
	return value
}

func GetGameObject(key string) models.Game {
	data, _ := rdb.Get(ctx, key).Result()

	var game models.Game

	log.Println("daata ->")
	log.Println(data)

	err := json.Unmarshal([]byte(data), &game)
	if err != nil {
		log.Println("Error deserializing game:", err)
	}

	log.Println("Game retrieved successfully from Redis:", game)
	return game
}

func ExistsInQueue(uid string) bool {
	_, err := rdb.ZScore(ctx, QUEUE_KEY, uid).Result()
	if err == redis.Nil {
		return false
	} else if err != nil {
		return false
	} else {
		return true
	}
}

func Connect() {
	rdb = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
}

func SubscribeToChannel(pubsub *redis.PubSub, c *websocket.Conn) {
	for val := range pubsub.Channel() {
		log.Println("Sending Message: ", val.Payload)
		c.WriteJSON(Response{"message", val.Payload})
	}
}

func WebSocketHandler(c *websocket.Conn) {
	uid := c.Cookies("uid")

	if uid == "" {
		c.WriteJSON(Response{"failure", "login first."})
		return
	}

	if check := AddtoQueue(uid); !check {
		log.Println("ALERT: Failure in Redis Connection most probably.")
		c.WriteJSON(Response{"failure", "Backend Error."})
		return
	}

	var gid string
	for {
		time.Sleep(time.Millisecond * 100)
		gid = ReadKey(uid)
		if gid != "" {
			break
		}
	}

	pubsub := rdb.Subscribe(ctx, gid)

	// Close PubSub
	defer pubsub.Close()

	// Delete redis entry
	defer rdb.Del(ctx, uid)

	// go SubscribeToChannel(pubsub, c)

	gamedetails, err := rdb.Get(ctx, gid).Result()
	if err != nil {
		log.Println("Unable to fetch game details.")
		return
	}

	var GameClient models.GameClient
	var Game models.Game

	json.Unmarshal([]byte(gamedetails), &Game)
	json.Unmarshal([]byte(gamedetails), &GameClient)

	questions := Game.Questions

	if err := c.WriteJSON(models.Response{Topic: "gameInit", Message: GameClient}); err != nil {
		log.Println(err)
		return
	}

	count := 0
	question := questions[count]
	if err := c.WriteJSON(models.Response{Topic: "question", Message: models.Round{Number: count + 1, Question: question}}); err != nil {
		log.Println(err)
		return
	}

	for {
		var message resp
		if err := c.ReadJSON(&message); err != nil {
			log.Println("ERROR: Unable to ReadJSON object from websocket. 1", err)
			return
		}

		switch message.Title {
		case "submit":
			if count > 4 {
				continue
			}
			if check := handleSubmitExpression(message.Message.(string), questions[count]); !check {
				if err := c.WriteJSON(models.Response{Topic: "submitResponse", Message: false}); err != nil {
					log.Println("error occurred..", err)
					return
				}
			} else {
				gamedetails, err = rdb.Get(ctx, gid).Result()
				if err != nil {
					log.Println("Unable to fetch game details from redis. ")
					return
				}
				json.Unmarshal([]byte(gamedetails), &Game)
				if Game.Playerone == uid {
					Game.Player1CurrRound = int64(count) + 1
					Game.Player1Solves = append(Game.Player1Solves, message.Message.(string))
				} else {
					// Update this
					Game.Player2CurrRound = int64(count) + 1
					Game.Player2Solves = append(Game.Player2Solves, message.Message.(string))
				}
				json.Unmarshal([]byte(gamedetails), &Game)
				gjson, _ := json.Marshal(Game)
				rdb.Set(ctx, gid, gjson, time.Minute*10)
				count++
				if err := c.WriteJSON(models.Response{Topic: "submitResponse", Message: true}); err != nil {
					log.Println("error occurred..", err)
					return
				}
				if err := c.WriteJSON(models.Response{Topic: "question", Message: models.Round{Number: count + 1, Question: questions[count]}}); err != nil {
					log.Println(err)
					return
				}
			}
		case "expression":
			gamedetails, _ = rdb.Get(ctx, gid).Result()
			json.Unmarshal([]byte(gamedetails), &Game)
			if Game.Playerone == uid {
				Game.Player1Expression = message.Message.(string)
			} else {
				Game.Player2Expression = message.Message.(string)
			}
			gjson, _ := json.Marshal(Game)
			rdb.Set(ctx, gid, gjson, time.Minute*10)
			log.Println("expr")
		case "gameData":
			gamedetails, _ = rdb.Get(ctx, gid).Result()
			json.Unmarshal([]byte(gamedetails), &GameClient)
			log.Println("Game Data Request")
			if err := c.WriteJSON(GameClient); err != nil {
				log.Println("Error writing to websocket, ", err)
				return
			}
		}
	}
}
