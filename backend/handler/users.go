package handler

import (
	"log"
	"strings"
	"time"

	"github.com/Hackfest-Hectoc/HectoClash/backend/database"
	"github.com/Hackfest-Hectoc/HectoClash/backend/models"
	"github.com/gofiber/fiber/v2"
)

func Register(c *fiber.Ctx) error {
	user := new(models.User)
	if err := c.BodyParser(user); err != nil {
		log.Println(err)
		return c.Status(fiber.ErrBadRequest.Code).JSON(ErrBadFormData)
	}
	user.Username = strings.TrimSpace(user.Username)
	user.Email = strings.ToLower(strings.TrimSpace(user.Email))

	if validationErr, ok := validate(user); !ok {
		return c.Status(fiber.StatusBadRequest).JSON(validationErr)
	}

	user.Games = []string{}
	if check := database.Register(user); !check {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrRegFailure)
	}

	log.Printf("LOG: User %s Registered.\n", user.Username)
	return c.Status(fiber.StatusCreated).JSON(RegSuccess)

}

func Login(c *fiber.Ctx) error {
	user := new(models.User)

	if err := c.BodyParser(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrBadFormData)
	}

	if len(user.Email) > 0 {
		user.Username = ""
	}

	uid, verifyUser := database.Verify(user.Username, user.Email, user.Password)

	if !verifyUser {
		return c.Status(fiber.StatusUnauthorized).JSON(ErrInvalidCreds)
	}

	if jwtString, err := createToken(uid); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrInLogin)
	} else {
		cookie := &fiber.Cookie{
			Name:     "token",
			Value:    jwtString,
			Expires:  time.Now().Add(24 * time.Hour),
			HTTPOnly: true,
			Secure:   false,
			SameSite: fiber.CookieSameSiteLaxMode,
			Path:     "/",
		}
		c.Cookie(cookie)
		uid_cookie := &fiber.Cookie{
			Name: "uid",
			Value: uid,
			HTTPOnly: false,
			Secure: false,
			Path:     "/",
		}
		c.Cookie(uid_cookie)
		return c.Status(fiber.StatusOK).JSON(LoggedIn)
	}
}
