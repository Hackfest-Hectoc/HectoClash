package database

import (
	"context"
	"log"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)
func newMongoClient() *mongo.Client {
	mongoTestClient, err := mongo.Connect(context.Background(), options.Client().ApplyURI(MONGOURI))
	if err != nil {
		log.Fatal("error while connecting mongodb", err)
	}
	log.Println("mongo connected")
	return mongoTestClient
}