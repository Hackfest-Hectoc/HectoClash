package handler

import (
	"encoding/json"
	"log"
	"math/rand"
	"strconv"
	"time"
	// "github.com/Hackfest-Hectoc/HectoClash/backend/database"
	"github.com/Hackfest-Hectoc/HectoClash/backend/models"
	"github.com/gofiber/contrib/websocket"
	"github.com/google/uuid"
)
func GenerateHectoc(count int) []string {
	// unsolvable := []int64{112117,114123,115567,115827,116567,121143,121581,131116,141171,156567,167181,167451,171717,175117,176611,178181,178188,178881,178888,178988,184156,185571,188788,188887,211143,211539,351117,361869,363369,366369,383888,388838,598999,611171,611177,617667,617676,617766,633639,639669,661667,664149,664989,666117,666161,666166,666615,666651,666661,666667,666761,667661,675151,676111,676167,676176,676667,676761,677761,681181,681667,711161,711781,717767,718178,718887,718888,719171,719878,745171,747778,747787,747877,748777,761117,761161,761767,766111,766861,767717,767761,771818,773167,773781,776761,778181,778451,778551,778978,781117,781171,781281,781676,781718,781888,781978,781987,787888,787889,788189,788789,788818,788878,788881,788971,789788,791887,797881,799971,817781,817789,817881,817888,818878,819787,819877,819878,819887,838383,838588,838858,838883,853878,858838,871888,877889,878181,878188,878538,878787,878789,878881,878887,878988,881788,881878,881887,881987,885838,887778,887818,887881,887888,888178,888187,888383,888717,888781,888787,888789,888817,888861,888871,888877,897878,897887,898771,898781,898878,951999,958999,961999,969199,969659,978788,978887}

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


var gid string = uuid.New().String()


func Practicehandler(c *websocket.Conn) {
	uid := c.Cookies("uid")

	if uid == "" {
		c.WriteJSON(Response{"failure", "login first."})
		return
	}
			
	Game.ID = gid
	Game.Status = "starting"
	Game.Questions = GenerateHectoc(5)
	Game.PlayerCurrRound = 1
	Gamejson, _ := json.Marshal(Game)

	rdb.Set(ctx, gid,Gamejson, time.Minute*10)

	questions := Game.Questions

	if err := c.WriteJSON(models.Response{Topic: "gameInit", Message: Game}); err != nil {
		log.Println(err)
		return
	}

	// var gid string
 
	count := 0
	question := questions[count]
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
				gamedetails, err := rdb.Get(ctx, gid).Result()
				if err != nil {
					log.Println("Unable to fetch game details from redis. ")
					return
				}
				json.Unmarshal([]byte(gamedetails), &Game)
				if count <= 4 {
					Game.PlayerQuestions[count] = questions[count]
				}
				Game.PlayerSolves[count-1] = message.Message.(string)
				
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
						gjson, _ := json.Marshal(Game)
						rdb.Set(ctx, gid, gjson, time.Minute*10)
					}
				}
			}
		// case "expression":
		// 	gamedetails, _ = rdb.Get(ctx, gid).Result()
		// 	json.Unmarshal([]byte(gamedetails), &Game)
		// 	if Game.Playerone == uid {
		// 		Game.Player1Expression = message.Message.(string)
		// 	} else {
		// 		Game.Player2Expression = message.Message.(string)
		// 	}
		// 	gjson, _ := json.Marshal(Game)
		// 	rdb.Set(ctx, gid, gjson, time.Minute*10)
		// 	log.Println("expr")
		case "gameData":
			gamedetails, _ := rdb.Get(ctx, gid).Result()
			json.Unmarshal([]byte(gamedetails), &Game)
			if err := c.WriteJSON(models.Response{Topic: "gameData", Message: Game}); err != nil {
				log.Println("Error writing to websocket, ", err)
				return
			}
		}
	}
}
