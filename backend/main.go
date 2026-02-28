package main

import (
	"database/sql"
	"log"
	"time"

	"github.com/durianpay/fullstack-boilerplate/internal/api"
	"github.com/durianpay/fullstack-boilerplate/internal/config"
	ah "github.com/durianpay/fullstack-boilerplate/internal/module/auth/handler"
	ar "github.com/durianpay/fullstack-boilerplate/internal/module/auth/repository"
	au "github.com/durianpay/fullstack-boilerplate/internal/module/auth/usecase"
	ph "github.com/durianpay/fullstack-boilerplate/internal/module/payment/handler"
	pr "github.com/durianpay/fullstack-boilerplate/internal/module/payment/repository"
	pu "github.com/durianpay/fullstack-boilerplate/internal/module/payment/usecase"
	"github.com/durianpay/fullstack-boilerplate/internal/seeder"
	srv "github.com/durianpay/fullstack-boilerplate/internal/service/http"
	redissvc "github.com/durianpay/fullstack-boilerplate/internal/service/redis"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	_ = godotenv.Load()

	db, err := sql.Open("sqlite3", "dashboard.db?_foreign_keys=1")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := seeder.Seed(db); err != nil {
		log.Fatal(err)
	}

	JwtExpiredDuration, err := time.ParseDuration(config.JwtExpired)
	if err != nil {
		panic(err)
	}

	// Redis
	redisClient := redissvc.NewClient(config.RedisAddr)
	defer redisClient.Close()

	userRepo := ar.NewUserRepo(db)
	authUC := au.NewAuthUsecase(userRepo, redisClient, config.JwtSecret, JwtExpiredDuration)
	authH := ah.NewAuthHandler(authUC)

	paymentRepo := pr.NewPaymentRepo(db)
	paymentUC := pu.NewPaymentUsecase(paymentRepo, redisClient)
	paymentH := ph.NewPaymentHandler(paymentUC)

	apiHandler := &api.APIHandler{
		Auth:    authH,
		Payment: paymentH,
	}

	server := srv.NewServer(apiHandler, config.OpenapiYamlLocation, config.JwtSecret)

	addr := config.HttpAddress
	log.Printf("starting server on %s", addr)
	server.Start(addr)
}
