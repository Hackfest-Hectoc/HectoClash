package routes

import (
	"github.com/Hackfest-Hectoc/HectoClash/backend/handler"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Post("/api/register", handler.Register).Name("Register")
	app.Post("/api/login", handler.Login).Name("Login")
	app.Get("/ws", websocket.New(handler.WebSocketHandler)).Name("Websocket handler")
}
