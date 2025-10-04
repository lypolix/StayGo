// Package main StayGo Routes with Swagger annotations
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
	"backend/internal/handlers"
	"backend/internal/middleware"

	"github.com/gin-gonic/gin"

	// Swagger UI (раскомментировать после `swag init` и установки зависимостей)
	// swaggerFiles "github.com/swaggo/files"
	// ginSwagger "github.com/swaggo/gin-swagger"
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
	// Swagger UI (после swag init)
	// import "github.com/swaggo/files"
	// import ginSwagger "github.com/swaggo/gin-swagger"
	// router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// CORS — уже есть, просто используем
	router.Use(middleware.CorsMiddleware())

	// Auth — публичные
	auth := router.Group("/auth")
	{
		// @Summary Регистрация пользователя
		// @Tags auth
		// @Accept json
		// @Produce json
		// @Param input body models.CreateUserDTO true "Данные регистрации"
		// @Success 201 {integer} int64 "ID созданного пользователя"
		// @Failure 400 {object} map[string]string "Неверные данные запроса или пользователь уже существует"
		// @Failure 500 {object} map[string]string "Внутренняя ошибка сервера"
		// @Router /auth/register [post]
		auth.POST("/register", a.authHandler.Register)

		// @Summary Логин
		// @Tags auth
		// @Accept json
		// @Produce json
		// @Param input body models.LoginUserDTO true "Email и пароль"
		// @Success 200 {object} models.AuthResponse "Пара токенов"
		// @Failure 400 {object} map[string]string "Неверные данные запроса"
		// @Failure 401 {object} map[string]string "Неверные учетные данные"
		// @Failure 500 {object} map[string]string "Внутренняя ошибка сервера"
		// @Router /auth/login [post]
		auth.POST("/login", a.authHandler.Login)
	}

	// Публичные данные отелей (GET): список, деталь, список комнат отеля
	hotels := router.Group("/hotels")
	{
		// @Summary Список отелей
		// @Tags hotels
		// @Produce json
		// @Success 200 {array} models.Hotel
		// @Failure 500 {object} map[string]string "Failed to get hotels"
		// @Router /hotels [get]
		hotels.GET("", a.hotelHandler.List)

		// @Summary Поиск отелей по городу
		// @Tags hotels
		// @Produce json
		// @Param city query string true "Название города"
		// @Success 200 {array} models.Hotel
		// @Failure 400 {object} map[string]string "invalid input | city query parameter is required"
		// @Failure 500 {object} map[string]string "internal error"
		// @Router /hotels/search [get]
		hotels.GET("/search", a.hotelHandler.ListByCity)

		// @Summary Получить отель по ID
		// @Tags hotels
		// @Produce json
		// @Param hotelid path int true "ID отеля"
		// @Success 200 {object} models.Hotel
		// @Failure 400 {object} map[string]string "invalid hotelid"
		// @Failure 404 {object} map[string]string "hotel not found"
		// @Router /hotels/{hotelid} [get]
		hotels.GET("/:hotelid", a.hotelHandler.GetByID)

		// @Summary Список комнат отеля
		// @Tags rooms
		// @Produce json
		// @Param hotelid path int true "ID отеля"
		// @Success 200 {array} models.Room
		// @Failure 400 {object} map[string]string "invalid hotel id"
		// @Failure 500 {object} map[string]string "failed to get rooms"
		// @Router /hotels/{hotelid}/rooms [get]
		hotels.GET("/:hotelid/rooms", a.roomHandler.ListByHotel)
	}

	// Публичные данные по комнатам (GET деталь)
	rooms := router.Group("/rooms")
	{
		// @Summary Получить комнату по ID
		// @Tags rooms
		// @Produce json
		// @Param roomid path int true "ID комнаты"
		// @Success 200 {object} models.Room
		// @Failure 400 {object} map[string]string "invalid room id"
		// @Failure 404 {object} map[string]string "room not found"
		// @Router /rooms/{roomid} [get]
		rooms.GET("/:roomid", a.roomHandler.GetByID)

		// @Summary Поиск комнат
		// @Tags rooms
		// @Produce json
		// @Param city query string true "Город"
		// @Param guests query int true "Количество гостей"
		// @Param checkin query string false "Дата заезда (YYYY-MM-DD)"
		// @Param checkout query string false "Дата выезда (YYYY-MM-DD)"
		// @Success 200 {array} models.Room
		// @Failure 400 {object} map[string]string "city and guests are required | invalid guests | invalid input"
		// @Failure 500 {object} map[string]string "internal error"
		// @Router /rooms/search [get]
		rooms.GET("/search", a.roomHandler.Search)

		// @Summary Отзывы по комнате
		// @Tags reviews
		// @Produce json
		// @Param roomid path int true "ID комнаты"
		// @Success 200 {array} models.Review
		// @Failure 400 {object} map[string]string "invalid room id | invalid input"
		// @Failure 500 {object} map[string]string "internal server error"
		// @Router /rooms/{roomid}/reviews [get]
		rooms.GET("/:roomid/reviews", a.reviewHandler.ListByRoomID)
	}

	// Защищённые группы
	users := router.Group("/users", a.authMiddleware.RequireAuth())
	{
		// @Summary Профиль текущего пользователя
		// @Tags users
		// @Security BearerAuth
		// @Produce json
		// @Success 200 {object} models.UserInfoDTO
		// @Failure 401 {object} map[string]string "user authentication required"
		// @Failure 404 {object} map[string]string "user not found"
		// @Failure 500 {object} map[string]string "internal server error"
		// @Router /users/me [get]
		users.GET("/me", a.userHandler.GetUserInfo)

		// @Summary Обновить профиль
		// @Tags users
		// @Security BearerAuth
		// @Accept json
		// @Produce json
		// @Param input body models.UserUpdateDTO true "Изменяемые поля профиля"
		// @Success 204 "Обновлено"
		// @Failure 400 {object} map[string]string "invalid body | no fields to update | invalid input | email already taken"
		// @Failure 401 {object} map[string]string "user authentication required"
		// @Failure 404 {object} map[string]string "user not found"
		// @Failure 500 {object} map[string]string "internal server error"
		// @Router /users/me [patch]
		users.PATCH("/me", a.userHandler.UpdateUserInfo)
	}

	admin := router.Group("/admin", a.authMiddleware.RequireAuth())
	{
		// @Summary Создать отель
		// @Tags admin
		// @Security BearerAuth
		// @Accept json
		// @Produce json
		// @Param input body models.Hotel true "Данные отеля"
		// @Success 201 {object} models.Hotel
		// @Failure 400 {object} map[string]string "Неверные данные запроса"
		// @Failure 401 {object} map[string]string "unauthorized"
		// @Failure 403 {object} map[string]string "Access denied"
		// @Failure 500 {object} map[string]string "failed to create hotel"
		// @Router /admin/hotels [post]
		admin.POST("/hotels", a.hotelHandler.Create)

		// @Summary Создать комнату
		// @Tags admin
		// @Security BearerAuth
		// @Accept json
		// @Produce json
		// @Param input body models.Room true "Данные комнаты"
		// @Success 201 {object} models.Room
		// @Failure 400 {object} map[string]string "invalid parameters | invalid input | invalid hotel_id"
		// @Failure 401 {object} map[string]string "unauthorized"
		// @Failure 403 {object} map[string]string "access denied"
		// @Failure 500 {object} map[string]string "internal error"
		// @Router /admin/rooms [post]
		admin.POST("/rooms", a.roomHandler.Create)

		// @Summary Удалить отзыв по ID
		// @Tags admin
		// @Security BearerAuth
		// @Produce json
		// @Param id path int true "ID отзыва"
		// @Success 204 "no content"
		// @Failure 400 {object} map[string]string "invalid review id | invalid input"
		// @Failure 401 {object} map[string]string "unauthorized"
		// @Failure 403 {object} map[string]string "access denied"
		// @Failure 404 {object} map[string]string "review not found"
		// @Failure 500 {object} map[string]string "internal server error"
		// @Router /admin/reviews/{id} [delete]
		admin.DELETE("/reviews/:id", a.reviewHandler.DeleteByID)
	}

	favorites := router.Group("/favorites", a.authMiddleware.RequireAuth())
	{
		// @Summary Добавить комнату в избранное
		// @Tags favorites
		// @Security BearerAuth
		// @Accept json
		// @Produce json
		// @Param input body models.FavoriteRoomDTO true "Данные избранного"
		// @Success 201 "Создано"
		// @Failure 400 {object} map[string]string "invalid body"
		// @Failure 401 {object} map[string]string "user authorization required"
		// @Failure 500 {object} map[string]string "failed to add favorite"
		// @Router /favorites [post]
		favorites.POST("", a.favoriteRoomHandler.Add)

		// @Summary Удалить комнату из избранного
		// @Tags favorites
		// @Security BearerAuth
		// @Produce json
		// @Param roomid path int true "ID комнаты"
		// @Success 204 "no content"
		// @Failure 400 {object} map[string]string "invalid roomid"
		// @Failure 401 {object} map[string]string "user authorization required"
		// @Failure 500 {object} map[string]string "failed to remove favorite"
		// @Router /favorites/{roomid} [delete]
		favorites.DELETE("/:roomid", a.favoriteRoomHandler.Remove)

		// @Summary Список избранных комнат текущего пользователя
		// @Tags favorites
		// @Security BearerAuth
		// @Produce json
		// @Success 200 {array} int64 "Список ID комнат"
		// @Failure 401 {object} map[string]string "user authorization required"
		// @Failure 500 {object} map[string]string "failed to list favorites"
		// @Router /favorites [get]
		favorites.GET("", a.favoriteRoomHandler.List)
	}

	reviews := router.Group("/reviews", a.authMiddleware.RequireAuth())
	{
		// @Summary Создать отзыв
		// @Tags reviews
		// @Security BearerAuth
		// @Accept json
		// @Produce json
		// @Param input body models.Review true "Отзыв"
		// @Success 201 {object} models.Review
		// @Failure 400 {object} map[string]string "bad request"
		// @Failure 401 {object} map[string]string "unauthorized"
		// @Failure 500 {object} map[string]string "internal server error"
		// @Router /reviews [post]
		reviews.POST("", a.reviewHandler.Create)

		// @Summary Свои отзывы
		// @Tags reviews
		// @Security BearerAuth
		// @Produce json
		// @Success 200 {array} models.Review
		// @Failure 401 {object} map[string]string "unauthorized"
		// @Failure 500 {object} map[string]string "internal server error"
		// @Router /reviews [get]
		reviews.GET("", a.reviewHandler.List)

		// @Summary Отзывы пользователя по ID
		// @Tags reviews
		// @Produce json
		// @Param userid path int true "ID пользователя"
		// @Success 200 {array} models.Review
		// @Failure 400 {object} map[string]string "invalid user id | invalid input"
		// @Failure 500 {object} map[string]string "internal server error"
		// @Router /reviews/users/{userid} [get]
		reviews.GET("/users/:userid", a.reviewHandler.ListByUserID)
	}

	return router
}
