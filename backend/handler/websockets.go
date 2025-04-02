package handler

import (
	"context"
	"log"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client

const (
	QUEUE_KEY = "matchmaking_queue"
)

var ctx = context.TODO()

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
		Protocol: 2,
	})
}

func SubscribeToChannel() {

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

	for {
		key := ReadKey(uid)
		if key != "" {
			break
		}
	}

	pubsub := rdb.Subscribe(ctx, QUEUE_KEY)
	defer pubsub.Close()
}
