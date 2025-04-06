package main

import (
	"context"
	"encoding/json"
	"log"
	"math/rand"
	"strconv"
	"time"

	"github.com/Hackfest-Hectoc/HectoClash/match-making-service/models"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client
var ctx = context.TODO()

const (
	QUEUE_KEY = "matchmaking_queue"
)

func Connect() {
	rdb = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	rdb.FlushAll(ctx)
}

func MatchMakingService() {
	for {
		count, err := rdb.ZCard(ctx, QUEUE_KEY).Result()
		if err != nil {
			log.Println("ERROR IN MATCHMAKING SERVICE!!", err)
			continue
		}
		if count > 1 {
			log.Println(count)
			topTwo, err := rdb.ZPopMax(ctx, QUEUE_KEY, 2).Result()
			if err == redis.Nil {
				continue
			}
			if err != nil {
				log.Println("ERROR IN MATCHMAKING SERVICE!!", err)
				continue
			}
			var first string = topTwo[0].Member.(string)
			var second string = topTwo[1].Member.(string)
			var gid string = uuid.New().String()

			// If client does not use their gid within 60 seconds
			// they will automatically be removed from the database
			var gameState models.Game

			gameState.StartTime = time.Now().Unix()
			// gameState.EndTime = 
			gameState.ID = gid
			gameState.Playerone = first
			gameState.Playertwo = second
			gameState.Status = "starting"
			gameState.Player1CurrRound = 1
			gameState.Player2CurrRound = 1
			gameState.Questions = GenerateHectoc(5)
			gameState.NoofRounds = 5
			gamestatejson, _ := json.Marshal(gameState)
			rdb.Set(ctx, gid,gamestatejson, time.Minute*10)
			rdb.Set(ctx, first, gid, time.Minute*10)
			rdb.Set(ctx, second, gid, time.Minute*10)


			log.Println("GID ", gid, "SET")
			log.Println("USERS: ", first, second, " RUNNING UNDER GID: ", gid)
		}
	}
}

func GenerateHectoc(count int) []string {
	unsolvable := map[int64]struct{}{
		112117: {}, 114123: {}, 115567: {}, 115827: {}, 116567: {},
		121143: {}, 121581: {}, 131116: {}, 141171: {}, 156567: {},
		167181: {}, 167451: {}, 171717: {}, 175117: {}, 176611: {},
		178181: {}, 178188: {}, 178881: {}, 178888: {}, 178988: {},
		184156: {}, 185571: {}, 188788: {}, 188887: {}, 211143: {},
		211539: {}, 351117: {}, 361869: {}, 363369: {}, 366369: {},
		383888: {}, 388838: {}, 598999: {}, 611171: {}, 611177: {},
		617667: {}, 617676: {}, 617766: {}, 633639: {}, 639669: {},
		661667: {}, 664149: {}, 664989: {}, 666117: {}, 666161: {},
		666166: {}, 666615: {}, 666651: {}, 666661: {}, 666667: {},
		666761: {}, 667661: {}, 675151: {}, 676111: {}, 676167: {},
		676176: {}, 676667: {}, 676761: {}, 677761: {}, 681181: {},
		681667: {}, 711161: {}, 711781: {}, 717767: {}, 718178: {},
		718887: {}, 718888: {}, 719171: {}, 719878: {}, 745171: {},
		747778: {}, 747787: {}, 747877: {}, 748777: {}, 761117: {},
		761161: {}, 761767: {}, 766111: {}, 766861: {}, 767717: {},
		767761: {}, 771818: {}, 773167: {}, 773781: {}, 776761: {},
		778181: {}, 778451: {}, 778551: {}, 778978: {}, 781117: {},
		781171: {}, 781281: {}, 781676: {}, 781718: {}, 781888: {},
		781978: {}, 781987: {}, 787888: {}, 787889: {}, 788189: {},
		788789: {}, 788818: {}, 788878: {}, 788881: {}, 788971: {},
		789788: {}, 791887: {}, 797881: {}, 799971: {}, 817781: {},
		817789: {}, 817881: {}, 817888: {}, 818878: {}, 819787: {},
		819877: {}, 819878: {}, 819887: {}, 838383: {}, 838588: {},
		838858: {}, 838883: {}, 853878: {}, 858838: {}, 871888: {},
		877889: {}, 878181: {}, 878188: {}, 878538: {}, 878787: {},
		878789: {}, 878881: {}, 878887: {}, 878988: {}, 881788: {},
		881878: {}, 881887: {}, 881987: {}, 885838: {}, 887778: {},
		887818: {}, 887881: {}, 887888: {}, 888178: {}, 888187: {},
		888383: {}, 888717: {}, 888781: {}, 888787: {}, 888789: {},
		888817: {}, 888861: {}, 888871: {}, 888877: {}, 897878: {},
		897887: {}, 898771: {}, 898781: {}, 898878: {}, 951999: {},
		958999: {}, 961999: {}, 969199: {}, 969659: {}, 978788: {},
		978887: {},
	}

	// rand.Seed(time.Now().UnixNano())
	var results []string

	for len(results) < count {
		var result string
		for i := 0; i < 6; i++ {
			digit := rand.Intn(9) + 1 // Random number between 1 and 9
			result += strconv.Itoa(digit)
		}
		num, _ := strconv.ParseInt(result, 10, 64)
		if _, found := unsolvable[num]; !found {
			results = append(results, result)
		}
	}

	return results
}

func main() {
	Connect()
	log.Println("CONNECTION SUCCESSFULL")
	MatchMakingService()
	// log.Println(GenerateHectoc(10))
}
