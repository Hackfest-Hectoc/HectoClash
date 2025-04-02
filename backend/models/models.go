package models

type User struct {
	Username string `bson:"username"`
	Userid   string `bson:"userid"`
	Email    string `bson:"email"`
	Password string `bson:"password"`
	Games    []Game `bson:"games"`
}

type Challenge struct {
	Round    int    `bson:"round"`
	Question string `bson:"question"`
}

type Round struct {
	PointsPlayerOne int                    `bson:"points-player-one"`
	PointsPlayerTwo int                    `bson:"points-player-two"`
	Challenges      []map[string][2]string `bson:"challenges"`
}

type Game struct {
	PlayerOne string        `bson:"player-one"`
	PlayerTwo string        `bson:"player-two"`
	GameId    string        `bson:"gameid"`
	Winner    int           `bson:"winner"`
	Rounds    map[int]Round `bson:"rounds"`
}
