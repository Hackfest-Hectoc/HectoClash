package handler

import (
	"github.com/Hackfest-Hectoc/HectoClash/backend/database"
	"github.com/Hackfest-Hectoc/HectoClash/backend/models"
	"github.com/gofiber/fiber/v2"
)

func PlayerID(c *fiber.Ctx) error {

	id := c.Params("id")

	user := database.GetUserFromID(id)

	if user == (models.UserDetails{}) {
		return c.Status(fiber.StatusNotFound).JSON(user)
	}

	return c.Status(fiber.StatusOK).JSON(user)
}
