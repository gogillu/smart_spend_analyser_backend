package main

import (
	"log"
	"net/http"
)

func homePage(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("home"))
}

func startServer() {
	http.HandleFunc("/", homePage)
	log.Fatal(http.ListenAndServe("localhost:8080", nil))
}
