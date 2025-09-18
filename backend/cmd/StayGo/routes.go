package main

import (
	"backend/internal/handlers"
	"backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

type Api struct {
	authHandler         *handlers.AuthHandler
	userHandler         *handlers.UserHandler
	authMiddleware      *middleware.AuthMiddleware
	hotelHandler        *handlers.HotelHandler
	favoriteRoomHandler *handlers.FavoriteRoomHandler
	roomHandler         *handlers.RoomHandler
	reviewHandler       *handlers.ReviewHandler
}

func NewApi(
	authHandler *handlers.AuthHandler,
	userHandler *handlers.UserHandler,
	authMiddleware *middleware.AuthMiddleware,
	hotelHandler *handlers.HotelHandler,
	favoriteRoomHandler *handlers.FavoriteRoomHandler,
	roomHandler *handlers.RoomHandler,
	reviewHandler *handlers.ReviewHandler,

) *Api {
	return &Api{
		authHandler:         authHandler,
		userHandler:         userHandler,
		authMiddleware:      authMiddleware,
		hotelHandler:        hotelHandler,
		favoriteRoomHandler: favoriteRoomHandler,
		roomHandler:         roomHandler,
		reviewHandler:       reviewHandler,
	}
}

func (a *Api) InitRoutes() *gin.Engine {
	router := gin.New()

	router.Use(middleware.СorsMiddleware())

	auth := router.Group("/auth")
	{
		auth.POST("/register", a.authHandler.Register) // регистрация
		auth.POST("/login", a.authHandler.Login)       // логин
	}

	users := router.Group("/users", a.authMiddleware.RequireAuth())
	{
		users.GET("/profile", a.userHandler.GetUserInfo)    // получение профиля
		users.PUT("/profile", a.userHandler.UpdateUserInfo) // обновление информации
	}

	hotels := router.Group("/hotels", a.authMiddleware.RequireAuth())
	{
		hotels.GET("", a.hotelHandler.List) //
		hotels.POST("", a.hotelHandler.Create)
		hotels.GET("/:hotel_id", a.hotelHandler.GetByID)
		hotels.GET("/:hotel_id/rooms", a.roomHandler.ListByHotel)
	}

	rooms := router.Group("/rooms", a.authMiddleware.RequireAuth())
	{
		rooms.POST("", a.roomHandler.Create) // создать комнату (только админы)
		rooms.GET("/:room_id", a.roomHandler.GetByID)
	}

	favorites := router.Group("/favorites", a.authMiddleware.RequireAuth())
	{
		favorites.POST("", a.favoriteRoomHandler.Add)               // добавить комнату в избранное
		favorites.DELETE("/:room_id", a.favoriteRoomHandler.Remove) // удалить комнату из избранного
		favorites.GET("", a.favoriteRoomHandler.List)               // получить список избранных комнат
	}

	reviews := router.Group("/reviews", a.authMiddleware.RequireAuth())
	{
		reviews.POST("", a.reviewHandler.Create) // добавить отзыв
		reviews.GET("", a.reviewHandler.List)    // получить отзывы комнаты
	}

	return router
}
