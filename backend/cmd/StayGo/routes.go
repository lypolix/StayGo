package main

import (
	"backend/internal/handlers"
	"backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

type Api struct {
	authHandler         handlers.AuthHandler
	userHandler         handlers.UserHandler
	authMiddleware      middleware.AuthMiddleware
	hotelHandler        handlers.HotelHandler
	favoriteRoomHandler handlers.FavoriteRoomHandler
	roomHandler         handlers.RoomHandler
	reviewHandler       handlers.ReviewHandler
}

func NewApi(
	authHandler handlers.AuthHandler,
	userHandler handlers.UserHandler,
	authMiddleware middleware.AuthMiddleware,
	hotelHandler handlers.HotelHandler,
	favoriteRoomHandler handlers.FavoriteRoomHandler,
	roomHandler handlers.RoomHandler,
	reviewHandler handlers.ReviewHandler,
) Api {
	return Api{
		authHandler:         authHandler,
		userHandler:         userHandler,
		authMiddleware:      authMiddleware,
		hotelHandler:        hotelHandler,
		favoriteRoomHandler: favoriteRoomHandler,
		roomHandler:         roomHandler,
		reviewHandler:       reviewHandler,
	}
}

func (a Api) InitRoutes() *gin.Engine {
	router := gin.New()
	// CORS — уже есть, просто используем
	router.Use(middleware.CorsMiddleware())

	// Auth — публичные
	auth := router.Group("/auth")
	{
		auth.POST("/register", a.authHandler.Register)
		auth.POST("/login", a.authHandler.Login)
	}

	// Публичные данные отелей (GET): список, деталь, список комнат отеля
	hotels := router.Group("/hotels")
	{
		hotels.GET("", a.hotelHandler.List)
		hotels.GET("/:hotelid", a.hotelHandler.GetByID)
		hotels.GET("/:hotelid/rooms", a.roomHandler.ListByHotel)
	}

	// Публичные данные по комнатам (GET деталь)
	rooms := router.Group("/rooms")
	{
		rooms.GET("/:roomid", a.roomHandler.GetByID)
		rooms.GET("/search", a.roomHandler.Search)
		rooms.GET("/:roomid/reviews", a.reviewHandler.ListByRoomID)
	}

	// Защищённые группы
	users := router.Group("/users", a.authMiddleware.RequireAuth())
	{
		users.GET("/profile", a.userHandler.GetUserInfo)
		users.PUT("/profile", a.userHandler.UpdateUserInfo)
	}

	admin := router.Group("admin", a.authMiddleware.RequireAuth())
	{
		// Админ-создание отелей и комнат
		admin.POST("/hotels", a.hotelHandler.Create)
		admin.POST("/rooms", a.roomHandler.Create)
		admin.DELETE("/reviews/:id", a.reviewHandler.DeleteByID)
	}

	favorites := router.Group("/favorites", a.authMiddleware.RequireAuth())
	{
		favorites.POST("", a.favoriteRoomHandler.Add)
		favorites.DELETE("/:roomid", a.favoriteRoomHandler.Remove)
		favorites.GET("", a.favoriteRoomHandler.List)
	}

	reviews := router.Group("/reviews", a.authMiddleware.RequireAuth())
	{
		reviews.POST("", a.reviewHandler.Create)
		reviews.GET("", a.reviewHandler.List)
	}

	return router
}
