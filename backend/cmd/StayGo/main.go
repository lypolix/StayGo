// Package main StayGo Backend API
//
// @title           StayGo Backend API
// @version         1.0
// @description     API для работы с отелями, комнатами, отзывами и избранным
// @BasePath        /
//
// @securityDefinitions.apikey BearerAuth
// @in              header
// @name            Authorization
package main

import (
	"backend/internal/config"
	"backend/internal/handlers"
	"backend/internal/logger"
	"backend/internal/middleware"
	"backend/internal/repos"
	"backend/internal/services"
	"log"
    _ "backend/docs"

	_"github.com/gin-gonic/gin"

	// Swagger UI
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	// Загрузка конфигурации
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("could not load config: %v", err)
	}

	// Инициализация БД
	db, err := config.InitDB(cfg.Database)
	if err != nil {
		log.Fatalf("could not connect to db: %v", err)
	}

	// Репозитории
	authRepo := repos.NewAuthRepo(db)
	userRepo := repos.NewUserInfoRepo(db)
	hotelRepo := repos.NewHotelRepo(db)
	favoriteRoomRepo := repos.NewFavoriteRoomRepo(db)
	roomRepo := repos.NewRoomRepo(db)
	reviewRepo := repos.NewReviewRepo(db)

	// Сервисы
	jwtService := services.NewJWTService(*cfg)
	authService := services.NewAuthService(cfg, authRepo, logger.NewLogger())
	userService := services.NewUserInfoServ(userRepo)
	hotelService := services.NewHotelService(hotelRepo)
	favoriteRoomService := services.NewFavoriteRoomService(favoriteRoomRepo)
	roomService := services.NewRoomService(roomRepo)

	// Middleware
	authMiddleware := middleware.NewAuthMiddleware(jwtService)

	// Хендлеры
	authHandler := handlers.NewAuthHandler(authService, &jwtService)
	userHandler := handlers.NewUserHandler(userService)
	hotelHandler := handlers.NewHotelHandler(hotelService)
	favoriteRoomHandler := handlers.NewFavoriteRoomHandler(favoriteRoomService)
	roomHandler := handlers.NewRoomHandler(roomService)
	reviewHandler := handlers.NewReviewHandler(*reviewRepo)

	// Инициализация API и маршрутов
	apiHandlers := NewApi(*authHandler, userHandler, authMiddleware, hotelHandler, favoriteRoomHandler, roomHandler, reviewHandler)
	r := apiHandlers.InitRoutes()

	// Подключение Swagger UI
	// Перейти по: http://localhost:8080/swagger/index.html
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Запуск сервера
	log.Println("Starting server on port 8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
