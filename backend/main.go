package main

import (
	"log"

	"github.com/ahomsi/explain-website/internal/config"
	"github.com/ahomsi/explain-website/internal/server"
)

func main() {
	cfg := config.Load()

	if err := server.Start(cfg); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
