package routes

import (
	"github.com/Hackfest-Hectoc/HectoClash/backend/handler"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func SetupRoutes(app *fiber.App) {
		app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173/",
		AllowCredentials: true,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
	}))
	app.Post("/api/register", handler.Register).Name("Register")
	app.Post("/api/login", handler.Login).Name("Login")
	app.Get("/ws", websocket.New(handler.WebSocketHandler)).Name("Websocket handler")
}

