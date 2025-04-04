package repository

import (
	"context"
	"go2/model"
	"log"
	"testing"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func newMongoClient() *mongo.Client {
	mongoTestClient, err := mongo.Connect(context.Background(), options.Client().ApplyURI("mongodb://admin:pass123@localhost:27017/"))
	if err != nil {
		log.Fatal("error while connecting mongodb", err)
	}
	log.Println("mongo connected")
	return mongoTestClient
}

func TestMongoOperations(t *testing.T) {
	mongoTestClient := newMongoClient()
	defer mongoTestClient.Disconnect(context.Background())

	emp1 := uuid.New().String()
	emp2 := uuid.New().String()

	coll := mongoTestClient.Database("companydb").Collection("employee_test")
	emprepo := EmployeeRepo{MongoCollection: coll}
	t.Run("Insert Employee 1", func(t *testing.T) {
		emp := model.Employee{
			Name:       "Tony Stark",
			Department: "Physics",
			EmployeeID: emp1,
		}
		result, err := emprepo.InsertEmployee(&emp)
		if err != nil {
			t.Fatal("insert 1 failed", err)
		}
		t.Log("insert 1 success", result)
	})
	t.Run("Insert Employee 2", func(t *testing.T) {
		emp := model.Employee{
			Name:       "Stark",
			Department: "ics",
			EmployeeID: emp2,
		}
		result, err := emprepo.InsertEmployee(&emp)
		if err != nil {
			t.Fatal("insert 2 failed", err)
		}
		t.Log("insert 2 success", result)
	})
	t.Run("Find Employee 1", func(t *testing.T) {
		result, err := emprepo.FindEmployeeID(emp1)
		if err != nil {
			t.Fatal("find 1 failed", err)
		}
		t.Log("Find 1 success", result.Name)
	})

}
