package main

import (
    "backend/internal/config"
    "backend/internal/handlers"
    "backend/internal/logger"
    "backend/internal/middleware"
    "backend/internal/repos"
    "backend/internal/services"
    "log"
)

func main() {
    cfg, err := config.LoadConfig()
    if err != nil {
        log.Fatalf("could not load config: %v", err)
    }

    db, err := config.InitDB(cfg.Database)
    if err != nil {
        log.Fatalf("could not connect to db: %v", err)
    }

    // Репозитории
    authRepo := repos.NewAuthRepo(db)
    userRepo := repos.NewUserInfoRepo(db)
    hotelRepo := repos.NewHotelRepo(db)
    favoriteRoomRepo := repos.NewFavoriteRoomRepo(db) // Имплементация должна быть создана
    roomRepo := repos.NewRoomRepo(db)                 // Имплементация должна быть создана
    reviewRepo := repos.NewReviewRepo(db)

    // Сервисы
    jwtService := services.NewJWTService(cfg)
    authService := services.NewAuthService(cfg, authRepo, logger.NewLogger())
    userService := services.NewUserInfoServ(userRepo)
    hotelService := services.NewHotelService(hotelRepo)
    favoriteRoomService := services.NewFavoriteRoomService(favoriteRoomRepo) // Имплементация должна быть создана
    roomService := services.NewRoomService(roomRepo)                         // Имплементация должна быть создана

    // Middleware
    authMiddleware := middleware.NewAuthMiddleware(jwtService)

    // Хендлеры
    authHandler := handlers.NewAuthHandler(authService, jwtService)
    userHandler := handlers.NewUserHandler(userService)
    hotelHandler := handlers.NewHotelHandler(hotelService)
    favoriteRoomHandler := handlers.NewFavoriteRoomHandler(favoriteRoomService) // Имплементация должна быть создана
    roomHandler := handlers.NewRoomHandler(roomService)                         // Имплементация должна быть создана
    reviewHandler := handlers.NewReviewHandler(reviewRepo)

    // Инициализация API с новыми хендлерами
    apiHandlers := NewApi(authHandler, userHandler, authMiddleware, hotelHandler, favoriteRoomHandler, roomHandler, reviewHandler)

    r := apiHandlers.InitRoutes()

    // Добавляем маршруты для отзывов


    log.Println("Starting server on port 8080")
    err = r.Run(":8080")
    if err != nil {
        log.Fatalf("Server failed: %v", err)
    }
}
