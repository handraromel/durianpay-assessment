package usecase

import (
	"context"
	"time"

	"github.com/durianpay/fullstack-boilerplate/internal/entity"
	"github.com/durianpay/fullstack-boilerplate/internal/module/auth/repository"
	redissvc "github.com/durianpay/fullstack-boilerplate/internal/service/redis"
	"github.com/golang-jwt/jwt/v5"
	goredis "github.com/redis/go-redis/v9"
	"golang.org/x/crypto/bcrypt"
)

const refreshTTL = 7 * 24 * time.Hour

type AuthUsecase interface {
	Login(email string, password string) (accessToken string, refreshToken string, user *entity.User, err error)
	RefreshAccessToken(refreshToken string) (accessToken string, newRefreshToken string, err error)
}

type Auth struct {
	repo      repository.UserRepository
	redis     *redissvc.Client
	jwtSecret []byte
	ttl       time.Duration
}

func NewAuthUsecase(repo repository.UserRepository, redis *redissvc.Client, jwtSecret []byte, ttl time.Duration) *Auth {
	return &Auth{repo: repo, redis: redis, jwtSecret: jwtSecret, ttl: ttl}
}

func refreshKey(userID string) string {
	return "refresh:" + userID
}

// Verify email + password and returns access and refresh tokens.
// The refresh token is persisted in Redis so only the latest token is valid.
func (a *Auth) Login(email string, password string) (string, string, *entity.User, error) {
	user, err := a.repo.GetUserByEmail(email)
	if err != nil {
		return "", "", nil, err
	}
	if user.ID == "" {
		return "", "", nil, entity.ErrorNotFound("user not found")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return "", "", nil, entity.WrapError(err, entity.ErrorCodeUnauthorized, "Invalid credentials")
	}

	accessToken, err := a.generateAccessToken(user)
	if err != nil {
		return "", "", nil, err
	}

	refreshToken, err := a.generateRefreshToken(user)
	if err != nil {
		return "", "", nil, err
	}

	// Store refresh token in Redis (single-token-per-user rotation)
	if err := a.redis.Set(context.Background(), refreshKey(user.ID), refreshToken, refreshTTL); err != nil {
		return "", "", nil, entity.ErrorInternal("failed to persist refresh token")
	}

	return accessToken, refreshToken, user, nil
}

// Generate a new access+refresh token pair from a valid refresh token.
func (a *Auth) RefreshAccessToken(refreshToken string) (string, string, error) {
	// Parse and validate the refresh token
	token, err := jwt.ParseWithClaims(refreshToken, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return a.jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return "", "", entity.ErrorUnauthorized("invalid refresh token")
	}

	claims, ok := token.Claims.(*jwt.MapClaims)
	if !ok {
		return "", "", entity.ErrorUnauthorized("invalid token claims")
	}

	// Verify the token type is refresh token
	if tokenType, ok := (*claims)["type"].(string); !ok || tokenType != "refresh" {
		return "", "", entity.ErrorUnauthorized("invalid token type")
	}

	// Get user ID from token
	userID, ok := (*claims)["sub"].(string)
	if !ok {
		return "", "", entity.ErrorUnauthorized("invalid token claims")
	}

	// Verify the token matches what's stored in Redis
	stored, err := a.redis.Get(context.Background(), refreshKey(userID))
	if err == goredis.Nil || stored != refreshToken {
		_ = a.redis.Del(context.Background(), refreshKey(userID)) // cleanup existing token if any
		return "", "", entity.ErrorUnauthorized("refresh token has been revoked")
	}
	if err != nil {
		return "", "", entity.ErrorInternal("failed to validate refresh token")
	}

	// Fetch user from db
	user, err := a.repo.GetUserByID(userID)
	if err != nil {
		return "", "", err
	}

	if user.ID == "" {
		return "", "", entity.ErrorNotFound("user not found")
	}

	// Generate new tokens
	accessToken, err := a.generateAccessToken(user)
	if err != nil {
		return "", "", err
	}

	newRefreshToken, err := a.generateRefreshToken(user)
	if err != nil {
		return "", "", err
	}

	// store the new refresh token, invalidating the old one
	if err := a.redis.Set(context.Background(), refreshKey(user.ID), newRefreshToken, refreshTTL); err != nil {
		return "", "", entity.ErrorInternal("failed to persist refresh token")
	}

	return accessToken, newRefreshToken, nil
}

func (a *Auth) generateAccessToken(user *entity.User) (string, error) {
	claims := jwt.MapClaims{
		"sub":  user.ID,
		"exp":  time.Now().Add(a.ttl).Unix(),
		"iat":  time.Now().Unix(),
		"type": "access",
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(a.jwtSecret)
	if err != nil {
		return "", entity.WrapError(err, entity.ErrorCodeUnauthorized, "failed to sign token")
	}
	return signed, nil
}

func (a *Auth) generateRefreshToken(user *entity.User) (string, error) {
	claims := jwt.MapClaims{
		"sub":  user.ID,
		"exp":  time.Now().Add(refreshTTL).Unix(),
		"iat":  time.Now().Unix(),
		"type": "refresh",
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(a.jwtSecret)
	if err != nil {
		return "", entity.WrapError(err, entity.ErrorCodeUnauthorized, "failed to sign token")
	}
	return signed, nil
}
