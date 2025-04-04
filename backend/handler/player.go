package handler

import ("github.com/gofiber/fiber/v2"
		"github.com/Hackfest-Hectoc/HectoClash/backend/database"
		"github.com/Hackfest-Hectoc/HectoClash/backend/models"
		)

func PlayerID(c* fiber.Ctx) error{

	id := c.Params("id")

	var user models.UserDetails



	user = database.GetUserFromID(id)

	if user == (models.UserDetails{}){
		return c.Status(fiber.StatusNotFound).JSON(user)
	}

	return c.Status(fiber.StatusOK).JSON(user)
} 