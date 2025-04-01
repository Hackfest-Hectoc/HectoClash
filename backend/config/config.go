package config

import "os"

func getEnv(key string, fallback string) string {
	value := os.Getenv(key)
	if len(value) == 0 {
		return fallback
	}
	return value
}

var MONGO_URI = getEnv("MONGO_URI", "mongodb+srv://abcd:saxsux@hectoc.phprdaf.mongodb.net/")
var JWT_SECRET = getEnv("JWT_SECRET", "bondissogood")