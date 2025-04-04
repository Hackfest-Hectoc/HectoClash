package main

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"sync"
)

// Message structure for WebSocket communication
type Message struct {
	Username string `json:"username"`
	Content  string `json:"content"`
	Topic    string `json:"topic"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true }, // Allow all origins for testing
}

// Clients map and synchronization
var clients = make(map[*websocket.Conn]bool)
var clientsMutex sync.RWMutex
var broadcast = make(chan Message)

// WebSocket connection handler
func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	defer func() {
		// Remove client on disconnection
		clientsMutex.Lock()
		delete(clients, ws)
		clientsMutex.Unlock()
		ws.Close()
	}()

	// Register new client
	clientsMutex.Lock()
	clients[ws] = true
	clientsMutex.Unlock()

	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Println("Read error:", err)
			break
		}
		log.Println(msg)
		// Send message to broadcast channel
		broadcast <- msg
	}
}

// Message broadcasting handler
func handleMessages() {
	for {
msg := <-broadcast

		clientsMutex.RLock()
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Println("Write error:", err)
				client.Close()
				clientsMutex.RUnlock()
				clientsMutex.Lock()
				delete(clients, client)
				clientsMutex.Unlock()
				clientsMutex.RLock()
			}
		}
		clientsMutex.RUnlock()
	}
}

func main() {
	// Start message broadcasting goroutine
	go handleMessages()

	// Serve WebSocket connections
	http.HandleFunc("/ws", handleConnections)

	log.Println("Server started on :6969")
	log.Fatal(http.ListenAndServe(":6969", nil))
}
