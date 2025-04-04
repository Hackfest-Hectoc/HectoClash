package handler

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client

const (
	QUEUE_KEY = "matchmaking_queue"
)

type resp struct {
	Title   string `json:"title"`
	Message string `json:"message"`
}

var ctx = context.TODO()

func PublishMessage(gid string, message resp) error {
	msg, _ := json.Marshal(message)
	err := rdb.Publish(ctx, QUEUE_KEY, msg).Err()
	if err != nil {
		return err
	}
	log.Println("Published message: ", message)
	return nil
}

func AddtoQueue(uid string) bool {
	timeStamp := float64(time.Now().Unix())
	_, err := rdb.ZAdd(ctx, QUEUE_KEY, redis.Z{
		Score:  timeStamp,
		Member: uid,
	}).Result()
	if err != nil {
		log.Println(err)
		return false
	}
	log.Printf("Player %s added to matchmaking queue.\n", uid)
	return true
}

func ReadKey(uid string) string {
	value, _ := rdb.Get(ctx, uid).Result()
	return value
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

	// if uid == "" {
	// 	c.WriteJSON(Response{"failure", "login first."})
	// 	return
	// }

	if check := AddtoQueue(uid); !check {
		log.Println("ALERT: Failure in Redis Connection most probably.")
		c.WriteJSON(Response{"failure", "Backend Error."})
		return
	}

	var gid string
	for {
		gid = ReadKey(uid)
		if gid != "" {
			break
		}
	}

	pubsub := rdb.Subscribe(ctx, QUEUE_KEY)
	defer pubsub.Close()
	go SubscribeToChannel(pubsub, c)

	for {
		var message resp
		if err := c.ReadJSON(&message); err != nil {
			log.Println(err)
			log.Println("ERROR: Unable to ReadJSON object from socket.")
			continue
		}
		log.Println(message)
		if err := PublishMessage(gid, message); err != nil {
			log.Println("Publish Error: ", err)
		}
	}
}
