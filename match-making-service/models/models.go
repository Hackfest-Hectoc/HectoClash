package models

import "context"

var ctx = context.TODO()

// import "time"

type Game struct {
	ID                string    `json:"gid"`
	Playerone         string    `json:"player_one"`
	Playertwo         string    `json:"player_two"`
	Status            string    `json:"status"`
	Player1Expression string    `json:"player1expression"`
	Player2Expression string    `json:"player2expression"`
	Player1CurrRound  int64     `json:"player1curround"`
	Player2CurrRound  int64     `json:"player2curround"`
	Player1Questions  [5]string `json:"player1questions"`
	Player2Questions  [5]string `json:"player2questions"`
	Player1Points     int64     `json:"player1points"`
	Player2Points     int64     `json:"player2points"`
	Winner            string    `json:"winner"`
	Player1Solves     [5]string `json:"player1solves"`
	Player2Solves     [5]string `json:"player2solves"`
	Questions         []string  `json:"questions"`
	NoofRounds        int64     `json:"noofrounds"`
	StartTime         int64     `json:"starttime"`
	EndTime           int64     `json:"endime"`
}

type GameClient struct {
	ID                   string    `json:"gid"`
	Playerone            string    `json:"player_one"`
	Playertwo            string    `json:"player_two"`
	Status               string    `json:"status"`
	Player1Expression    string    `json:"player1expression"`
	Player2Expression    string    `json:"player2expression"`
	Player1Solves        [5]string `json:"player1solves"`
	Player2Solves        [5]string `json:"player2solves"`
	Player1Questions     [5]string `json:"player1questions"`
	Player2Questions     [5]string `json:"player2questions"`
	Winner               string    `json:"winner"`
	Player1CurrRound     int64     `json:"player1curround"`
	Player2CurrRound     int64     `json:"player2curround"`
	Player1Points        int64     `json:"player1points"`
	Player2Points        int64     `json:"player2points"`
	Player1RatingChanges int64     `json:"player1ratingchanges"`
	Player2RatingChanges int64     `json:"player2ratingchanges"`
	NoofRounds           int64     `json:"noofrounds"`
}
