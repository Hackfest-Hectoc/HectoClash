package handler

import (
	"log"
	"math"

	"github.com/Hackfest-Hectoc/HectoClash/backend/database"
	"github.com/Hackfest-Hectoc/HectoClash/backend/models"
)

func ExpectedScore(ratingA, ratingB int64) float64 {
    return 1.0 / (1.0 + math.Pow(10, float64(ratingB-ratingA)/400))
}

func GiveElo(winner, loser *models.UserDetails) {
    expectedWin := ExpectedScore(winner.Rating, loser.Rating)
    expectedLose := ExpectedScore(loser.Rating, winner.Rating)

    winner.Rating += int64(float64(2) * (1.0 - expectedWin))
    loser.Rating += int64(float64(2) * (0.0 - expectedLose))
    log.Println(winner.Rating)
    log.Println(loser.Rating)

    database.UpdateRatinginMongo(winner, loser)
}
