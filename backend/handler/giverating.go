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

func GiveElo(winner, loser *models.UserDetails) (int64, int64) {
    expectedWin := ExpectedScore(winner.Rating, loser.Rating)
    expectedLose := ExpectedScore(loser.Rating, winner.Rating)

    winnerRatingChange := int64(float64(2) * (1.0 - expectedWin))
    loserRatingChange := int64(float64(2) * (1.0 - expectedLose))
    winner.Rating += winnerRatingChange
    loser.Rating += loserRatingChange
    log.Println(winner.Rating)
    log.Println(loser.Rating)

    database.UpdateRatinginMongo(winner, loser)
    return winnerRatingChange, loserRatingChange
}
