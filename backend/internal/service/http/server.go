package http

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/durianpay/fullstack-boilerplate/internal/docs"
	"github.com/durianpay/fullstack-boilerplate/internal/openapigen"
	"github.com/getkin/kin-openapi/openapi3filter"
	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/golang-jwt/jwt/v5"
	oapinethttpmw "github.com/oapi-codegen/nethttp-middleware"
)

type Server struct {
	router http.Handler
}

const (
	readTimeout  = 10
	writeTimeout = 10
	idleTimeout  = 60
)

func jwtAuthFunc(secret []byte) openapi3filter.AuthenticationFunc {
	return func(ctx context.Context, input *openapi3filter.AuthenticationInput) error {
		if input.SecuritySchemeName != "bearerAuth" {
			return fmt.Errorf("unsupported security scheme: %s", input.SecuritySchemeName)
		}

		req := input.RequestValidationInput.Request
		header := req.Header.Get("Authorization")
		if header == "" {
			return fmt.Errorf("missing authorization header")
		}

		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			return fmt.Errorf("invalid authorization header format")
		}

		tokenStr := parts[1]
		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			return secret, nil
		})
		if err != nil || !token.Valid {
			return fmt.Errorf("invalid or expired token")
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return fmt.Errorf("invalid token claims")
		}

		if tokenType, _ := claims["type"].(string); tokenType != "access" {
			return fmt.Errorf("invalid token type")
		}

		return nil
	}
}

func NewServer(apiHandler openapigen.ServerInterface, openapiYamlPath string, jwtSecret []byte) *Server {
	swagger, err := openapigen.GetSwagger()
	if err != nil {
		log.Fatalf("failed to load swagger: %v", err)
	}

	r := chi.NewRouter()

	// Global middleware
	r.Use(chimw.Logger)
	r.Use(chimw.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// API Documentation (Swagger UI)
	r.Get("/docs", docs.SwaggerUIHandler())
	r.Get("/docs/openapi.yaml", docs.OpenAPISpecHandler(openapiYamlPath))

	// All API routes — the OpenAPI validator handles request validation
	// and JWT authentication (via AuthenticationFunc) for secured endpoints.
	r.Route("/", func(api chi.Router) {
		api.Use(oapinethttpmw.OapiRequestValidatorWithOptions(
			swagger,
			&oapinethttpmw.Options{
				DoNotValidateServers:  true,
				SilenceServersWarning: true,
				Options: openapi3filter.Options{
					AuthenticationFunc: jwtAuthFunc(jwtSecret),
				},
			},
		))
		openapigen.HandlerFromMux(apiHandler, api)
	})

	return &Server{
		router: r,
	}
}

func (s *Server) Start(addr string) {
	service := &http.Server{
		Addr:         addr,
		Handler:      s.router,
		ReadTimeout:  readTimeout * time.Second,
		WriteTimeout: writeTimeout * time.Second,
		IdleTimeout:  idleTimeout * time.Second,
	}
	go func() {
		log.Printf("listening on %s", addr)
		err := service.ListenAndServe()
		if err != nil {
			log.Fatal(err.Error())
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)

	<-stop
	log.Println("Shutting down gracefully...")

	// Timeout for shutdown
	const shutdownTimeout = 10 * time.Second
	ctx, cancel := context.WithTimeout(context.Background(), shutdownTimeout)
	defer cancel()

	if err := service.Shutdown(ctx); err != nil {
		log.Fatalf("Forced shutdown: %v", err)
	}

	log.Println("Server stopped cleanly ✔")
}

func (s *Server) Routes() http.Handler {
	return s.router
}
