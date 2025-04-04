package models
var ctx = context.TODO()


// import "time"

type Game struct {
	ID                    string   `json:"string"`
	Playerone             string   `json:"player-one"`
	Playertwo             string   `json:"player-two"`
	Status                string   `json:"status"`
	Player1Expression     string   `json:"player1expression"`
	Player2Expression     string   `json:"player2expression"`
	Player1CurrRound      int64   `json:"player1curround"`
	Player2CurrRound      int64   `json:"player2curround"`
	Player1LastSubmission int64   `json:"player1lastsubmission"`
	Player2LastSubmission int64   `json:"player2lastsubmission"`
	Player1Points         int64    `json:"player1points"`
	Player2Points         int64    `json:"player2points"`
	Questions             []string `json:"questions"`
	NoofRounds            int64    `json:"noofrounds"`
}

type GameClient struct {
	ID                    string   `json:"string"`
	Playerone             string   `json:"player-one"`
	Playertwo             string   `json:"player-two"`
	Status                string   `json:"status"`
	Player1Expression     string   `json:"player1expression"`
	Player2Expression     string   `json:"player2expression"`
	Player1CurrRound      int64    `json:"player1curround"`
	Player2CurrRound      int64    `json:"player2curround"`
	Player1Points         int64    `json:"player1points"`
	Player2Points         int64    `json:"player2points"`
	NoofRounds            int64    `json:"noofrounds"`
}
