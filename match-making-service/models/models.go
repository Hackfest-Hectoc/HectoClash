package models 

type Game struct {
	ID string `json:"string"`
	Playerone string `json:"player-one"`
	Playertwo string `json:"player-two"`
	Status string `json:"status"`
}