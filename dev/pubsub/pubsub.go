package main

import (
    "log"
    "net/http"
    "sync"
    "time"

    "github.com/gorilla/websocket"
)

// Message structure for WebSocket communication
type Message struct {
    Username string `json:"username"`
    Content  string `json:"content"`
    Topic    string `json:"topic"` // Topic/room for pub-sub
}

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin:     func(r *http.Request) bool { return true }, // Allow all origins for testing
}

// Clients map and synchronization
type Client struct {
    conn  *websocket.Conn
    topic string
}

var (
    clients      = make(map[*websocket.Conn]*Client)
    clientsMutex sync.RWMutex // RWMutex allows concurrent reads

    pubSubConn  *websocket.Conn
    pubSubChan  = make(chan Message, 100) // Buffered channel for Pub/Sub messages
)

// Connect to Pub/Sub WebSocket server
func connectToPubSub() {
    var err error
    pubSubConn, _, err = websocket.DefaultDialer.Dial("ws://localhost:6969/ws", nil)
    if err != nil {
        log.Fatal("Failed to connect to Pub/Sub:", err)
    }
    log.Println("Connected to Pub/Sub at ws://localhost:6969")

    // Start listening for messages from Pub/Sub
    go listenPubSub()

    // Start a single goroutine to process Pub/Sub writes
    go pubSubWriter()
}

// WebSocket connection handler for clients
func handleConnections(w http.ResponseWriter, r *http.Request) {
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println("Upgrade error:", err)
        return
    }
    defer ws.Close()

    var topic struct{
	    Topic string `json:"topic"`
    }
    if err := ws.ReadJSON(&topic); err != nil {
        log.Println("Topic subscription error:", err)
        return
    }

    // Register new client
    clientsMutex.Lock()
    clients[ws] = &Client{conn: ws, topic: topic.Topic}
    clientsMutex.Unlock()

    for {
        var msg Message
        err := ws.ReadJSON(&msg)
        if err != nil {
            log.Println("Read error:", err)

            // Remove client on error
            clientsMutex.Lock()
            delete(clients, ws)
            clientsMutex.Unlock()
            break
        }
	    log.Println(msg.Username)

        // Publish message to Pub/Sub (using channel)
        pubSubChan <- msg
    }
}

// Goroutine: Listens for messages from Pub/Sub and broadcasts to clients
func listenPubSub() {
    for {
        var msg Message
        err := pubSubConn.ReadJSON(&msg)
        if err != nil {
            log.Println("Error reading from Pub/Sub:", err)
            time.Sleep(2 * time.Second) // Reconnect on error
            connectToPubSub()
            return
        }

        // Broadcast message to clients
        broadcastMessage(msg)
    }
}

// Goroutine: Reads from pubSubChan and sends messages to Pub/Sub WebSocket
func pubSubWriter() {
    for msg := range pubSubChan {
        if pubSubConn != nil {
            err := pubSubConn.WriteJSON(msg)
            if err != nil {
                log.Println("Error sending message to Pub/Sub:", err)
            }
        }
    }
}

// Broadcast message to clients subscribed to the topic
func broadcastMessage(msg Message) {
    clientsMutex.RLock() // Allow concurrent reads
    defer clientsMutex.RUnlock()

    for _, client := range clients {
        if client.topic == msg.Topic {
            err := client.conn.WriteJSON(msg)
            if err != nil {
                log.Println("Write error:", err)
                client.conn.Close()

                // Upgrade to write lock before modifying
                clientsMutex.RUnlock()
                clientsMutex.Lock()
                delete(clients, client.conn)
                clientsMutex.Unlock()
                clientsMutex.RLock()
            }
        }
    }
}

func main() {
    // Connect to the Pub/Sub server first
    connectToPubSub()

    // Serve WebSocket connections
    http.HandleFunc("/ws", handleConnections)

    log.Println("WebSocket server started on :8081")
    log.Fatal(http.ListenAndServe(":8081", nil))
}

