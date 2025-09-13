package main

import (
	"backend/internal/config"
	"backend/internal/handlers"
	"backend/internal/middleware"
	"backend/internal/repos"
	"backend/internal/services"
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	r := gin.Default()

	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("could not load config: %v", err)
	}

	db, err := config.InitDB(cfg.Database)
	if err != nil {
		log.Fatalf("could not connect to db: %v", err)
	}

	authRepo := repos.NewAuthRepo(db)
	userRepo := repos.NewUserInfoRepo(db)
	hotelRepo := repos.NewHotelRepo(db)

	jwtService := services.NewJWTService(cfg)
	authMiddleware := middleware.NewAuthMiddleware(jwtService)
	authService := services.NewAuthService(cfg, authRepo)
	userService := services.NewUserInfoServ(userRepo)
	hotelService := services.NewHotelService(hotelRepo)

	authhandler := handlers.NewAuthHandler(authService, jwtService)
	userHandler := handlers.NewUserHandler(userService)
	hotelHandler := handlers.NewHotelHandler(hotelService)

	apiHandlers := NewApi(authhandler, userHandler, authMiddleware, hotelHandler)

	r.Run(":8080")
}
