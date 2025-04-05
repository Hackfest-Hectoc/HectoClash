package models

import "context"

var ctx = context.TODO()

// import "time"

type Game struct {
	ID                string   `json:"gid"`
	Playerone         string   `json:"player_one"`
	Playertwo         string   `json:"player_two"`
	Status            string   `json:"status"`
	Player1Expression string   `json:"player1expression"`
	Player2Expression string   `json:"player2expression"`
	Player1CurrRound  int64    `json:"player1curround"`
	Player2CurrRound  int64    `json:"player2curround"`
	Player1Solves     []string `json:"player1solves"`
	Player2Solves     []string `json:"player2solves"`
	Player1Points     int64    `json:"player1points"`
	Player2Points     int64    `json:"player2points"`
	Questions         []string `json:"questions"`
	NoofRounds        int64    `json:"noofrounds"`
}

type GameClient struct {
	ID                string   `json:"gid"`
	Playerone         string   `json:"player-one"`
	Playertwo         string   `json:"player-two"`
	Status            string   `json:"status"`
	Player1Expression string   `json:"player1expression"`
	Player2Expression string   `json:"player2expression"`
	Player1CurrRound  int64    `json:"player1curround"`
	Player1Solves     []string `json:"player1solves"`
	Player2Solves     []string `json:"player2solves"`
	Player2CurrRound  int64    `json:"player2curround"`
	Player1Points     int64    `json:"player1points"`
	Player2Points     int64    `json:"player2points"`
	NoofRounds        int64    `json:"noofrounds"`
}
