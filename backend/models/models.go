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
	Userid   string `bson:"userid" json:"userid"`
	Username string `bson:"username" json:"username"`
	Rating   int64  `bson:"rating" json:"rating"`
}

type Challenge struct {
	Round    int    `bson:"round"`
	Question string `bson:"question"`
}

type Round struct {
	Number   int    `json:"number"`
	Question string `json:"question"`
}

type Game struct {
	ID                string   `json:"gid"`
	Playerone         string   `json:"player_one"`
	Playertwo         string   `json:"player_two"`
	Status            string   `json:"status"`
	Player1Expression string   `json:"player1expression"`
	Player2Expression string   `json:"player2expression"`
	Player1CurrRound  int64    `json:"player1curround"`
	Player2CurrRound  int64    `json:"player2curround"`
	Player1Points     int64    `json:"player1points"`
	Player2Points     int64    `json:"player2points"`
	Player1Solves     []string `json:"player1solves"`
	Player2Solves     []string `json:"player2solves"`
	Questions         []string `json:"questions"`
	NoofRounds        int64    `json:"noofrounds"`
}

type GameClient struct {
	ID                   string   `json:"gid"`
	Playerone            string   `json:"player_one"`
	Playertwo            string   `json:"player_two"`
	Status               string   `json:"status"`
	Player1Expression    string   `json:"player1expression"`
	Player2Expression    string   `json:"player2expression"`
	Player1Solves        []string `json:"player1solves"`
	Player2Solves        []string `json:"player2solves"`
	Player1Questions     []string `json:"player1questions"`
	Player2Questions     []string `json:"player2questions"`
	Player1CurrRound     int64    `json:"player1curround"`
	Player2CurrRound     int64    `json:"player2curround"`
	Player1Points        int64    `json:"player1points"`
	Player2Points        int64    `json:"player2points"`
	Player1RatingChanges int64    `json:"player1ratingchanges"`
	Player2RatingChanges int64    `json:"player2ratingchanges"`
	NoofRounds           int64    `json:"noofrounds"`
}

type Response struct {
	Topic   string `json:"title"`
	Message any    `json:"message"`
}
