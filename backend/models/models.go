package models

// import "time"

type Profile struct {
}

type RatingEntry struct {
	Rating    float64 `bson:"ratingval" json:"ratingval"`
	Timestamp int64   `bson:"timestamp" json:"timestamp"`
}
type User struct {
	Username    string        `bson:"username" json:"username"`
	Userid      string        `bson:"userid" json:"userid"`
	Email       string        `bson:"email" json:"email"`
	Password    string        `bson:"password" json:"password"`
	Games       []string      `bson:"games" json:"games"`
	Ratings     []RatingEntry `bson:"ratings" json:"ratings"`
	Rating      int64         `bson:"rating" json:"rating"`
	TotalTime   int64         `bson:"time" json:"time"`
	TotalSolves int64         `bson:"solves" json:"solves"`
	WrongSolves int64         `bson:"wrongsolves" json:"wrongsolves"`
	TotalWins   int64         `bson:"totalwins" json:"totalwins"`
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

type GameAndWin struct {
	GID      string `json:gid`
	Opponent string `json:"opponent"`
	Win      int    `json:"win"`
}

type PracticeClient struct {
	ID     string `json:"gid"`
	Status string `json:"status"`
	// PlayerExpression string   `json:"player1expression"`
	PlayerSolves    []string `json:"player1solves"`
	PlayerQuestions []string `json:"playerquestions"`
	Questions       []string `json:"questions"`
	PlayerCurrRound int64    `json:"player1curround"`
	NoofRounds      int64    `json:"noofrounds"`
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
	Player1RightSolves   int64    `json:player1rightsolves`
	Player2RightSolves   int64    `json:player2rightsolves`
	Player1WrongSolves   int64    `json:player1wrongsolves`
	Player2WrongSolves   int64    `json:player2wrongsolves`
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
	StartTime            int64    `json:"starttime"`
	EndTime              int64    `json:"endtime"`
	Player1RightSolves   int64    `json:player1rightsolves`
	Player2RightSolves   int64    `json:player2rightsolves`
	Player1WrongSolves   int64    `json:player1wrongsolves`
	Player2WrongSolves   int64    `json:player2wrongsolves`
}

type Response struct {
	Topic   string `json:"title"`
	Message any    `json:"message"`
}
