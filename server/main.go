package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

// Simple signaling server using Server-Sent Events (SSE) + HTTP POST
// No external dependencies. Clients open an EventSource to /events?room=...&id=...
// and POST messages to /signal which the server forwards to other peers in the same room.

type Signal struct {
	From    string          `json:"from"`
	To      string          `json:"to,omitempty"`
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

var rooms = struct {
	sync.RWMutex
	m map[string]map[string]chan string
}{m: make(map[string]map[string]chan string)}

func main() {
	addr := flag.String("addr", ":8080", "server address")
	staticDir := flag.String("static", "./static", "static files directory")
	flag.Parse()

	http.HandleFunc("/events", eventsHandler)
	http.HandleFunc("/signal", signalHandler)
	http.Handle("/", http.FileServer(http.Dir(*staticDir)))

	log.Printf("Starting SSE signaling server at %s serving %s", *addr, *staticDir)
	log.Fatal(http.ListenAndServe(*addr, nil))
}

func eventsHandler(w http.ResponseWriter, r *http.Request) {
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "streaming unsupported", http.StatusInternalServerError)
		return
	}
	room := r.URL.Query().Get("room")
	id := r.URL.Query().Get("id")
	if room == "" || id == "" {
		http.Error(w, "room and id required", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	// register client
	ch := make(chan string, 16)
	rooms.Lock()
	m, ok := rooms.m[room]
	if !ok {
		m = make(map[string]chan string)
		rooms.m[room] = m
	}
	m[id] = ch
	rooms.Unlock()

	// notify join
	notifyRoom(room, fmt.Sprintf("{\"type\":\"join\",\"id\":\"%s\"}", id), id)

	// keep connection open and stream messages
	notify := func(msg string) {
		fmt.Fprintf(w, "data: %s\n\n", msg)
		flusher.Flush()
	}

	// send initial pong
	notify("{\"type\":\"connected\"}")

	// loop reading from channel and sending
	keepAlive := time.NewTicker(25 * time.Second)
	defer keepAlive.Stop()

	for {
		select {
		case msg, ok := <-ch:
			if !ok {
				return
			}
			notify(msg)
		case <-r.Context().Done():
			// client disconnected
			rooms.Lock()
			if m, ok := rooms.m[room]; ok {
				delete(m, id)
				if len(m) == 0 {
					delete(rooms.m, room)
				}
			}
			rooms.Unlock()
			notifyRoom(room, fmt.Sprintf("{\"type\":\"leave\",\"id\":\"%s\"}", id), id)
			return
		case <-keepAlive.C:
			// send a comment as keepalive
			fmt.Fprint(w, ": keepalive\n\n")
			flusher.Flush()
		}
	}
}

func signalHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "POST required", http.StatusMethodNotAllowed)
		return
	}
	var s Signal
	if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	// forward to target or broadcast to room
	// require query param room
	room := r.URL.Query().Get("room")
	if room == "" {
		http.Error(w, "room required", http.StatusBadRequest)
		return
	}
	b, _ := json.Marshal(s)
	msg := string(b)

	if s.To != "" {
		// send to specific peer
		rooms.RLock()
		if m, ok := rooms.m[room]; ok {
			if ch, ok := m[s.To]; ok {
				select {
				case ch <- msg:
				default:
				}
			}
		}
		rooms.RUnlock()
	} else {
		// broadcast to all except sender
		notifyRoom(room, msg, s.From)
	}

	w.WriteHeader(http.StatusNoContent)
}

func notifyRoom(room, msg, except string) {
	rooms.RLock()
	defer rooms.RUnlock()
	if m, ok := rooms.m[room]; ok {
		for id, ch := range m {
			if id == except {
				continue
			}
			select {
			case ch <- msg:
			default:
			}
		}
	}
}