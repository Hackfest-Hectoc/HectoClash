package models

type User struct {
	Username string `bson:"username"`
	Userid   string `bson:"userid"`
	Email    string `bson:"email"`
	Password string `bson:"password"`
	Games    []Game `bson:"games"`
	Rating   int64  `bson:"rating"`
}

type UserDetails struct {
	Username string `bson:"username"`
	Rating   int64  `bson:"rating"`
}

type Challenge struct {
	Round    int    `bson:"round"`
	Question string `bson:"question"`
}

type Round struct {
	Number   int    `json:"number"`
	Question string `json:"question"`
}

// type Game struct {
// 	PlayerOne string        `bson:"player-one"`
// 	PlayerTwo string        `bson:"player-two"`
// 	GameId    string        `bson:"gameid"`
// 	Winner    int           `bson:"winner"`
// 	Rounds    map[int]Round `bson:"rounds"`
// }

type Game struct {
	ID                    string   `json:"gid"`
	Playerone             string   `json:"player-one"`
	Playertwo             string   `json:"player-two"`
	Status                string   `json:"status"`
	Player1Expression     string   `json:"player1expression"`
	Player2Expression     string   `json:"player2expression"`
	Player1CurrRound      int64    `json:"player1curround"`
	Player2CurrRound      int64    `json:"player2curround"`
	Player1LastSubmission int64    `json:"player1lastsubmission"`
	Player2LastSubmission int64    `json:"player2lastsubmission"`
	Player1Points         int64    `json:"player1points"`
	Player2Points         int64    `json:"player2points"`
	Questions             []string `json:"questions"`
	NoofRounds            int64    `json:"noofrounds"`
}

type GameClient struct {
	ID                string `json:"gid"`
	Playerone         string `json:"player-one"`
	Playertwo         string `json:"player-two"`
	Status            string `json:"status"`
	Player1Expression string `json:"player1expression"`
	Player2Expression string `json:"player2expression"`
	Player1CurrRound  int64  `json:"player1curround"`
	Player2CurrRound  int64  `json:"player2curround"`
	Player1Points     int64  `json:"player1points"`
	Player2Points     int64  `json:"player2points"`
	NoofRounds        int64  `json:"noofrounds"`
}

type Response struct {
	Topic   string `json:"topic"`
	Message any    `json:"message"`
}
