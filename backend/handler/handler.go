package handler

import (
	"encoding/json"
	"log"
	"time"

	"github.com/Hackfest-Hectoc/HectoClash/backend/database"
	"github.com/Hackfest-Hectoc/HectoClash/backend/models"
	"github.com/gofiber/fiber/v2"
	"github.com/redis/go-redis/v9"
)

func UpdateLeaderboardinRedis(c *fiber.Ctx) error {

	s, err := rdb.Get(ctx, LEADER_BOARD).Result()
	if err == redis.Nil {
		marsheledLead, err := json.Marshal(database.ReturnTop20())
		if err != nil {
			log.Println("could not marsh")
		}
		rdb.Set(ctx, LEADER_BOARD, marsheledLead, 60*time.Second)
		s, _ = rdb.Get(ctx, LEADER_BOARD).Result()
	}
	var user []models.UserDetails

	_ = json.Unmarshal([]byte(s), &user)
	return (c.Status(fiber.StatusOK).JSON(user))
}
