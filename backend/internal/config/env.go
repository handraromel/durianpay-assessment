package config

import (
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var (
	JwtSecret           = []byte(getEnv("JWT_SECRET", "dev-secret-replace-me"))
	JwtExpired          = getEnv("JWT_EXPIRED", "24h")
	HttpAddress         = getEnv("HTTP_ADDR", ":8080")
	OpenapiYamlLocation = getEnv("OPENAPIYAML_LOCATION", "../openapi.yaml")
	RedisAddr           = getEnv("REDIS_ADDR", "localhost:6379")
)

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
