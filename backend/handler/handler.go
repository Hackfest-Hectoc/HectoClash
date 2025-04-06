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

func GetProfilePageStuff(c *fiber.Ctx) error{

	id := c.Params("id")
	user := database.GetprofilefromMongo(id)
	// userw , _:= database.GetGamesWithWins(c.Params("id"))
	// v:= {id:user,3:userw}

	return c.Status(fiber.StatusOK).JSON(user)
}
func GamesAll(c *fiber.Ctx) error{

	// id := c.Params("id")
	user,  err := database.GetGamesMongo()
	if(err!=nil){
		log.Println(err)
	}
	// userw , _:= database.GetGamesWithWins(c.Params("id"))
	// v:= {id:user,3:userw}

	return c.Status(fiber.StatusOK).JSON(user)
}

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

func GetMatches(c *fiber.Ctx) error {

	user , err:= database.GetNoOfMatches(c.Params("id"))

	if err!= nil{
		log.Println("couldnt retrive from mongo")
		return err
	}
	
	return (c.Status(fiber.StatusOK).JSON(user))
}

func GetWinsStruct(c *fiber.Ctx) error {

	user , err:= database.GetGamesWithWins(c.Params("id"))

	if err!= nil{
		log.Println("couldnt retrive from mongo")
		return err
	}
	
	return (c.Status(fiber.StatusOK).JSON(user))
}


