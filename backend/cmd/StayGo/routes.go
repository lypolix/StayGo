package main

import (
	"backend/internal/handlers"
	"backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

type Api struct {
	authHandler    *handlers.AuthHandler
	userHandler    *handlers.UserHandler
	authMiddleware *middleware.AuthMiddleware
	hotelHandler   *handlers.HotelHandler
}

func NewApi(authHandler *handlers.AuthHandler, userHandler *handlers.UserHandler,
	authMiddleware *middleware.AuthMiddleware, hotelHandler *handlers.HotelHandler) *Api {
	return &Api{
		authHandler:    authHandler,
		userHandler:    userHandler,
		authMiddleware: authMiddleware,
		hotelHandler:   hotelHandler,
	}
}

func (a *Api) InitRoutes() *gin.Engine {
	router := gin.New()

	// Auth маршруты
	auth := router.Group("/auth")
	{
		auth.POST("/register", a.authHandler.Register) // регистрация
		auth.POST("/login", a.authHandler.Login)       // логин
	}

	// User маршруты
	users := router.Group("/users", a.authMiddleware.RequireAuth())
	{
		users.GET("/profile", a.userHandler.GetUserInfo)    // получение профиля
		users.PUT("/profile", a.userHandler.UpdateUserInfo) // обновление информации профиля
	}

	// 	Hotel маршруты
	hotels := router.Group("/hotels", a.authMiddleware.RequireAuth()) // создать отель (с правами админа)
	{
		hotels.POST("", a.hotelHandler.Create)

	}

	return router
}
