package database

// Modify all this
import (
	"context"
	"fmt"
	"github.com/Hackfest-Hectoc/HectoClash/backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepository struct {
	Collection *mongo.Collection
}

func (r *UserRepository) InsertUser(users *models.User) (interface{}, error) {
	result, err := r.Collection.InsertOne(context.Background(), users)
	if err != nil {
		return nil, err
	}
	return result.InsertedID, nil
}

// func (r *UserRepository) FindEmployeeByID(empID string) (*models.User, error) {
	// 	var user models.User
	// 	err := r.Collection.FindOne(context.Background(), bson.M{"employee_id": empID}).Decode(&emp)
	// 	if err != nil {
		// 		return nil, err
		// 	}
		// 	return &emp, nil
		// }
		
func (r *UserRepository) FindAllUsers() ([]models.User, error) {
	results, err := r.Collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	var users []models.User
	if err = results.All(context.Background(), &users); err != nil {
		return nil, fmt.Errorf("results decode error: %s", err.Error())
	}
	return users, nil
}

func (r *UserRepository) UpdateUserByID(UseridID string, updateUser *models.User) (int64, error) {
	result, err := r.Collection.UpdateOne(context.Background(), bson.M{"userid": UseridID}, bson.M{"$set": updateUser})
	if err != nil {
		return 0, err
	}
	return result.ModifiedCount, nil
}

func (r *UserRepository) DeleteUserByID(Userid string) (int64, error) {
	result, err := r.Collection.DeleteOne(context.Background(), bson.M{"userid": Userid})
	if err != nil {
		return 0, err
	}
	return result.DeletedCount, nil
}
		
func EmailExists(email string) bool {
	return email == ""
}

func UserExists(username string) bool {
	return username == ""
}

func Register(username, password, email string) bool {
	return username != "" && password != "" && email != ""
}