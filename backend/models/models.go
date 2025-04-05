package models

type User struct {
	Username string   `bson:"username"`
	Userid   string   `bson:"userid"`
	Email    string   `bson:"email"`
	Password string   `bson:"password"`
	Games    []string `bson:"games"`
	Rating   int64    `bson:"rating"`
}

type UserDetails struct {
	Userid   string `bson:"userid" json:"uid"`
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

type PracticeClient struct {
	ID               string   `json:"gid"`
	Status           string   `json:"status"`
	// PlayerExpression string   `json:"player1expression"`
	PlayerSolves     []string `json:"player1solves"`
	PlayerQuestions  []string `json:"playerquestions"`
	Questions        []string `json:"questions"`
	PlayerCurrRound  int64    `json:"player1curround"`
	NoofRounds       int64    `json:"noofrounds"`
}

type GameClient struct {
	ID                   string   `json:"gid"`
	Playerone            string   `json:"player_one"`
	Playertwo            string   `json:"player_two"`
	Player1name          string   `json:"player1name"`
	Player2name          string   `json:"player2name"`
	Status               string   `json:"status"`
	Winner               string   `json:"winner"`
	Player1Expression    string   `json:"player1expression"`
	Player2Expression    string   `json:"player2expression"`
	Player1Solves        []string `json:"player1solves"`
	Player2Solves        []string `json:"player2solves"`
	Player1Questions     []string `json:"player1questions"`
	Player2Questions     []string `json:"player2questions"`
	Questions            []string `json:"questions"`
	Player1CurrRound     int64    `json:"player1curround"`
	Player2CurrRound     int64    `json:"player2curround"`
	Player1Points        int64    `json:"player1points"`
	Player2Points        int64    `json:"player2points"`
	Player1RatingChanges int64    `json:"player1ratingchanges"`
	Player2RatingChanges int64    `json:"player2ratingchanges"`
	NoofRounds           int64    `json:"noofrounds"`
}

type Game struct {
	ID                   string   `json:"gid"`
	Playerone            string   `json:"player_one"`
	Playertwo            string   `json:"player_two"`
	Player1name          string   `json:"player1name"`
	Player2name          string   `json:"player2name"`
	Status               string   `json:"status"`
	Winner               string   `json:"winner"`
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
	Questions            []string `json:"questions"`
	NoofRounds           int64    `json:"noofrounds"`
}

type Response struct {
	Topic   string `json:"title"`
	Message any    `json:"message"`
}
