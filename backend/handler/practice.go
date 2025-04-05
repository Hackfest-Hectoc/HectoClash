package handler

import (
	"encoding/json"
	"log"
	"math/rand"
	"strconv"
	"time"

	"github.com/Hackfest-Hectoc/HectoClash/backend/database"
	"github.com/Hackfest-Hectoc/HectoClash/backend/models"
	"github.com/gofiber/contrib/websocket"
	"go.mongodb.org/mongo-driver/v2/internal/uuid"
)
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

var Game models.PracticeClient


func MatchMakingService() {
for {


		var gid string = uuid.New().String()

		
		Game.ID = gid
		Game.Status = "starting"
		Game.Questions = GenerateHectoc(5)
		Game.PlayerCurrRound = 1
		Gamejson, _ := json.Marshal(Game)

		rdb.Set(ctx, gid,Gamejson, time.Minute*10)


	}

}

func Practicehandler(c *websocket.Conn) {
	uid := c.Cookies("uid")

	if uid == "" {
		c.WriteJSON(Response{"failure", "login first."})
		return
	}


	questions := Game.Questions

	if err := c.WriteJSON(models.Response{Topic: "gameInit", Message: Game}); err != nil {
		log.Println(err)
		return
	}

	count := 0
	question := questions[count]
	Game.Player1Questions[count] = questions[count]
	gjson, _ := json.Marshal(Game)
	rdb.Set(ctx, gid, gjson, time.Minute*10)

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
				count++
				gamedetails, err = rdb.Get(ctx, gid).Result()
				if err != nil {
					log.Println("Unable to fetch game details from redis. ")
					return
				}
				json.Unmarshal([]byte(gamedetails), &Game)
				if Game.Playerone == uid {
					Game.Player1CurrRound = int64(count) + 1
					if count <= 4 {
						Game.Player1Questions[count] = questions[count]
					}
					Game.Player1Solves[count-1] = message.Message.(string)
				} else {
					// Update this
					Game.Player2CurrRound = int64(count) + 1
					if count <= 4 {
						Game.Player2Questions[count] = questions[count]
					}
					Game.Player2Solves[count-1] = message.Message.(string)
				}
				log.Printf("%+v", Game)
				gjson, _ := json.Marshal(Game)
				rdb.Set(ctx, gid, gjson, time.Minute*10)
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
					gamedetails, _ := rdb.Get(ctx, gid).Result()
					json.Unmarshal([]byte(gamedetails), &Game)
					if Game.Status != "completed" {
						Game.Status = "completed"
						Game.Winner = uid
						gjson, _ := json.Marshal(Game)
						rdb.Set(ctx, gid, gjson, time.Minute*10)
						winner := database.GetUserFromID(uid)
						var player string
						if uid == Game.Playerone {
							player = Game.Playerone
						} else {
							player = Game.Playertwo
						}
						loser := database.GetUserFromID(player)
						GiveElo(&winner, &loser)
					}
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
			if err := c.WriteJSON(models.Response{Topic: "gameData", Message: GameClient}); err != nil {
				log.Println("Error writing to websocket, ", err)
				return
			}
		}
	}
}
