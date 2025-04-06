package handler

import (
	"encoding/json"
	"log"
	"time"

	"github.com/Hackfest-Hectoc/HectoClash/backend/models"
	"github.com/gofiber/contrib/websocket"
	"github.com/google/uuid"
)

type BattleRoyale struct {
	Host              string              `bson:"host" json:"host"`
	Players           []string            `bson:"player" json:"players"` // At max 10
	PlayersCount      int                 `bson:"players_count" json:"players_count"`
	PlayerSolves      map[string][]string `bson:"player_solves" json:"player_solves"`
	Rounds            int                 `bson:"rounds" json:"rounds"`
	Questions         []string            `bson:"questions" json:"questions"`
	CurrentRound      map[string]int      `bson:"current_round" json:"current_round"`
	Status            string              `bson:"status" json:"status"`
	Gid               string              `bson:"gid" json:"gid"`
	Eliminated        []string            `bson:"eliminated" json:"eliminated"`
	MaxSubmissionTime int64               `bson:"max_submission_time" json:"max_submission_time"`
	Winner            string              `bson:"winner" json:"winner"`
}

func Initialize(host string, rounds, count int) *BattleRoyale {
	var br *BattleRoyale = &BattleRoyale{
		Host:              host,
		PlayersCount:      count,
		Rounds:            rounds,
		Status:            "waiting",
		Questions:         GenerateHectoc(10),
		MaxSubmissionTime: int64(time.Minute * 10),
	}
	var gid string = uuid.New().String()
	if brstringify, err := json.Marshal(br); err != nil {
		log.Println("Unable to initialize BR struct")
		return nil
	} else {
		_, err := rdb.Set(ctx, gid, brstringify, time.Minute*10).Result()
		if err != nil {
			log.Println("Error putting game struct in redis database.")
			return nil
		}
	}
	return br
}

func getBRdata(gid string) (*BattleRoyale, bool) {
	var br *BattleRoyale
	if brstring, err := rdb.Get(ctx, gid).Result(); err != nil {
		return nil, false
	} else {
		if err := json.Unmarshal([]byte(brstring), br); err != nil {
			return nil, false
		}
		return br, true
	}
}

func setBRdata(gid string, br *BattleRoyale) bool {
	if brstring, err := json.Marshal(br); err != nil {
		log.Println("error serialzing the br data")
		return false
	} else {
		if err := rdb.Set(ctx, gid, brstring, time.Minute*15); err != nil {
			log.Println("error setting data in redis.")
			return false
		}
		return true
	}
}

func sendGameData(gid string, c *websocket.Conn) {
	if br, ok := getBRdata(gid); !ok {
		c.WriteJSON(models.Response{Topic: "error", Message: "server error"})
		return
	} else {
		if err := c.WriteJSON(models.Response{Topic: "gameData", Message: *br}); err != nil {
			return
		}
	}
}

func (game *BattleRoyale) AddPlayer(uid string) bool {
	if game.PlayersCount > 9 {
		return false
	}
	game.Players = append(game.Players, uid)
	game.PlayersCount++
	return true
}

func (game *BattleRoyale) EliminatePlayer(uid ...string) {
	game.Eliminated = append(game.Eliminated, uid...)
}

func (game *BattleRoyale) AddWinner(uid string) {
	game.Winner = uid
}

func (game *BattleRoyale) AddPlayerSolve(uid string, solve string) {
	game.PlayerSolves[uid] = append(game.PlayerSolves[uid], solve)
	game.CurrentRound[uid]++
}

func handleSubmit(uid, gid, message string, c *websocket.Conn) {
	var br *BattleRoyale
	br, _ = getBRdata(gid)
	if check := handleSubmitExpression(message, br.Questions[len(br.PlayerSolves[uid])]); !check {
		if err := c.WriteJSON(models.Response{Topic: "submit", Message: false}); err != nil {
			c.Close()
			return
		}
	} else {
		// desperate try to avoid race conditions.
		br, _ = getBRdata(gid)
		br.PlayerSolves[uid] = append(br.PlayerSolves[uid], message)
		setBRdata(gid, br)
		if err := c.WriteJSON(models.Response{Topic: "submit", Message: true}); err != nil {
			c.Close()
			return
		}
		if err := c.WriteJSON(models.Response{Topic: "question", Message: br.Questions[len(br.PlayerSolves[uid])]}); err != nil {
			c.Close()
			return
		}
	}
}

func HandleBRGame(c *websocket.Conn) {
	uid := c.Cookies("uid")
	if uid == "" {
		c.WriteJSON(models.Response{Topic: "error", Message: "Login First."})
		return
	}
	gid := c.Query("gid")
	if gid == "" {
		c.WriteJSON(models.Response{Topic: "error", Message: "Get a valid link."})
		return
	}

	var br *BattleRoyale
	var ok bool
	if br, ok = getBRdata(gid); !ok {
		c.WriteJSON(models.Response{Topic: "error", Message: "No game found."})
		log.Println("Error retrieving BR data, perhaps does not exist in Redis.")
		return
	}

	if check := br.AddPlayer(uid); !check {
		c.WriteJSON(models.Response{Topic: "error", Message: "Max players reached."})
		return
	}
	if ok := setBRdata(gid, br); !ok {
		c.WriteJSON(models.Response{Topic: "error", Message: "Backend Error."})
		log.Println("Unable to set BR data.")
		return
	}

	response := new(models.Response)
	for {
		if err := c.ReadJSON(response); err != nil {
			c.WriteJSON(models.Response{Topic: "error", Message: "Malformed Request"})
			log.Println(err)
			return
		}

		switch response.Topic {
		case "gameData":
			sendGameData(gid, c)
		case "submit":
			handleSubmit(uid, gid, response.Message.(string), c)
		}
	}
}
