package handler

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/Hackfest-Hectoc/HectoClash/backend/database"
	"github.com/Hackfest-Hectoc/HectoClash/backend/models"
	"github.com/gofiber/contrib/websocket"
	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client
var ctx = context.TODO()

const (
	QUEUE_KEY    = "matchmaking_queue"
	LEADER_BOARD = "leaderboard"
)

type resp struct {
	Title   string `json:"title"`
	Message any    `json:"message"`
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

func GameExists(uid string) bool {
	_, err := rdb.Get(ctx, uid).Result()
	return err != redis.Nil
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

	if check := GameExists(uid); !check {
		if check := AddtoQueue(uid); !check {
			log.Println("ALERT: Failure in Redis Connection most probably.")
			c.WriteJSON(Response{"failure", "Backend Error."})
			return
		}
	}

	var gid string
	for {
		time.Sleep(time.Millisecond * 100)
		gid = ReadKey(uid)
		if gid != "" {
			break
		}
	}

	var game models.Game
	p2, _ := rdb.Get(ctx, gid).Result()
	json.Unmarshal([]byte(p2), &game)
	defer rdb.Del(ctx, game.Playerone)
	defer rdb.Del(ctx, game.Playertwo)
	defer rdb.Del(ctx, gid)

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
	Game.Player1Questions[count] = questions[count]
	Game.Player2Questions[count] = questions[count]
	gjson, _ := json.Marshal(Game)
	rdb.SetXX(ctx, gid, gjson, time.Minute*10)

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
			if count==5{
				continue
			}
			if check := handleSubmitExpression(message.Message.(string), questions[count]); !check {
				err := c.WriteJSON(models.Response{Topic: "submitResponse", Message: false}) 
				if(GameClient.Playerone == uid){
					
					// GameClient.Player1WrongSolves = append(GameClient.Player1Expression, )
				}
				if err != nil {
					log.Println("error occurred..", err)	
					return
				}
			} else {
				count++
				gamedetails, err = rdb.Get(ctx, gid).Result()
				if err != nil {
					log.Println("Unable to fetch game details from redis. ")
					return
				}
				json.Unmarshal([]byte(gamedetails), &Game)
				if Game.Playerone == uid {
					if count <= 4 {
						Game.Player1CurrRound = int64(count) + 1
						Game.Player1Questions[count] = questions[count]
					}
					Game.Player1Solves[count-1] = message.Message.(string)
				} else {
					// Update this

					if count <= 4 {
						Game.Player2CurrRound = int64(count) + 1
						Game.Player2Questions[count] = questions[count]
					}
					Game.Player2Solves[count-1] = message.Message.(string)
				}
				log.Printf("%+v", Game)
				gjson, _ := json.Marshal(Game)
				err := rdb.SetXX(ctx, gid, gjson, time.Minute*10)
				if err != nil {
					return
				}
				if err := c.WriteJSON(models.Response{Topic: "submitResponse", Message: true}); err != nil {
					log.Println("error occurred..", err)
					return
				}
				if count <= 4 {
					if err := c.WriteJSON(models.Response{Topic: "question", Message: models.Round{Number: count + 1, Question: questions[count]}}); err != nil {
						log.Println(err)
						return
					}
				}
				if count == 5 {
					gamedetails, err := rdb.Get(ctx, gid).Result()
					if err != nil {
						return
					}
					json.Unmarshal([]byte(gamedetails), &Game)
					if Game.Status != "completed" {
						Game.Status = "completed"
						Game.EndTime = time.Now().Unix()
						Game.Winner = uid
						gjson, _ := json.Marshal(Game)
						rdb.SetXX(ctx, gid, gjson, time.Minute*10)
						database.AddGameToPlayer(Game.Playerone, gid)
						database.AddGameToPlayer(Game.Playertwo, gid)
						winner := database.GetUserFromID(uid)
						var player string
						if uid == Game.Playerone {
							player = Game.Playertwo
						} else {
							player = Game.Playerone
						}
						loser := database.GetUserFromID(player)
						winnerRatingChange, loserRatingChange := GiveElo(&winner, &loser)
						if (winner.Userid == Game.Playerone) {
							Game.Player1RatingChanges = winnerRatingChange
							Game.Player2RatingChanges = loserRatingChange
						} else {
							Game.Player2RatingChanges = winnerRatingChange
							Game.Player1RatingChanges = loserRatingChange
						}
						database.AddGameRecord(&Game)
					}
				}
			}
		case "expression":
			gamedetails, err = rdb.Get(ctx, gid).Result()
			if err != nil {
				return
			}
			json.Unmarshal([]byte(gamedetails), &Game)
			if Game.Playerone == uid {
				Game.Player1Expression = message.Message.(string)
			} else {
				Game.Player2Expression = message.Message.(string)
			}
			gjson, _ := json.Marshal(Game)
			rdb.SetXX(ctx, gid, gjson, time.Minute*10)
		case "gameData":
			gamedetails, err = rdb.Get(ctx, gid).Result()
			if err != nil {
				return 
			}
			json.Unmarshal([]byte(gamedetails), &GameClient)
			if err := c.WriteJSON(models.Response{Topic: "gameData", Message: GameClient}); err != nil {
				log.Println("Error writing to websocket, ", err)
				return
			}
		}
	}
}

func Spectate(c *websocket.Conn) {
	gid := c.Query("gid")
	
	if gamedata, err := rdb.Get(ctx, gid).Result(); err != nil {
		c.Close()
	} else {
		var gamejson models.Game
		json.Unmarshal([]byte(gamedata), &gamejson)
		if err := c.WriteJSON(models.Response{Topic: "gameInit", Message: gamejson}); err != nil {
			log.Println(err)
			return
		}
	}

	var game models.Game
	for {
		message := new(resp)
		if err := c.ReadJSON(message); err != nil {
			log.Println(err)
			return
		}
		if message.Title == "gameData" {
			stringform, _ := rdb.Get(ctx, gid).Result()
			json.Unmarshal([]byte(stringform), &game)
			if err := c.WriteJSON(models.Response{Topic: "gameData", Message: game}); err != nil {
				log.Println(err)
				return
			}
		}
	}
}
