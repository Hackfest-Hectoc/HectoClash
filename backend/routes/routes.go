package routes

import (
	"github.com/Hackfest-Hectoc/HectoClash/backend/handler"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func SetupRoutes(app *fiber.App) {
		app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173/, http://34.100.248.83:5173, http://192.168.43.43:5173, http://192.168.43.22:5173/, http://192.168.43.22:8000, http://localhost:8000",
		AllowCredentials: true,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
	}))
	app.Post("/api/register", handler.Register).Name("Register")
	app.Post("/api/login", handler.Login).Name("Login")
	app.Get("/api/player/:id", handler.PlayerID).Name("Get Player Details from ID")
	app.Get("/api/leaderboard", handler.UpdateLeaderboardinRedis).Name("Get Leaderboard")
	app.Get("/spectate", websocket.New(handler.Spectate)).Name("Spectate Handler")
	app.Get("/ws", websocket.New(handler.WebSocketHandler)).Name("Websocket handler")
	app.Get("/pracmode", websocket.New(handler.Practicehandler)).Name("PracMode handler")
}

