package handlers

import (
	"backend/internal/erors"
	"backend/internal/models"
	"backend/internal/services"
	"context"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type RoomHandler struct {
	roomService services.RoomServiceInterface
}

func NewRoomHandler(service services.RoomServiceInterface) RoomHandler {
	return RoomHandler{roomService: service}
}

// Create создать комнату (admin)
// @Summary Создать комнату
// @Tags rooms
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param input body models.Room true "Данные комнаты"
// @Success 201 {object} models.Room
// @Failure 400 {object} map[string]string "invalid parameters | invalid input | invalid hotel_id"
// @Failure 403 {object} map[string]string "access denied"
// @Failure 500 {object} map[string]string "internal error"
// @Router /rooms [post]
func (h RoomHandler) Create(c *gin.Context) {
	roleVal, exists := c.Get("userRole")
	role, ok := roleVal.(string)
	if !exists || !ok || role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
		return
	}

	var room models.Room
	if err := c.ShouldBindJSON(&room); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid parameters"})
		return
	}

	// Базовая валидация до БД
	if room.HotelID <= 0 ||
		room.Beds <= 0 ||
		room.Price < 0 ||
		strings.TrimSpace(room.Description) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	if err := h.roomService.CreateRoom(ctx, &room); err != nil {
		switch {
		case errors.Is(err, erors.ErrInvalidHotelID):
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid hotel_id"})
			return
		case errors.Is(err, erors.ErrInvalidInput):
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
			return
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusCreated, room)
}

// ListByHotel список комнат отеля
// @Summary Получить список комнат по ID отеля
// @Tags rooms
// @Produce json
// @Param hotelid path int true "ID отеля"
// @Success 200 {array} models.Room
// @Failure 400 {object} map[string]string "invalid hotel id"
// @Failure 500 {object} map[string]string "failed to get rooms"
// @Router /hotels/{hotelid}/rooms [get]
func (h RoomHandler) ListByHotel(c *gin.Context) {
	hotelIDStr := c.Param("hotelid")
	hotelID, err := strconv.ParseInt(hotelIDStr, 10, 64)
	if err != nil || hotelID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid hotel id"})
		return
	}

	rooms, err := h.roomService.GetRoomsByHotelID(c.Request.Context(), hotelID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get rooms"})
		return
	}

	c.JSON(http.StatusOK, rooms)
}

// GetByID получить комнату по ID
// @Summary Получить комнату по ID
// @Tags rooms
// @Produce json
// @Param roomid path int true "ID комнаты"
// @Success 200 {object} models.Room
// @Failure 400 {object} map[string]string "invalid room id"
// @Failure 404 {object} map[string]string "room not found"
// @Router /rooms/{roomid} [get]
func (h RoomHandler) GetByID(c *gin.Context) {
	roomIDStr := c.Param("roomid")
	roomID, err := strconv.ParseInt(roomIDStr, 10, 64)
	if err != nil || roomID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid room id"})
		return
	}

	room, err := h.roomService.GetByID(c.Request.Context(), roomID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "room not found"})
		return
	}

	c.JSON(http.StatusOK, room)
}

// Search поиск комнат
// @Summary Поиск комнат по городу, гостям и датам
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
func (h RoomHandler) Search(c *gin.Context) {
	city := strings.TrimSpace(c.Query("city"))
	guestsStr := strings.TrimSpace(c.Query("guests"))
	if city == "" || guestsStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "city and guests are required"})
		return
	}
	guests, err := strconv.Atoi(guestsStr)
	if err != nil || guests <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid guests"})
		return
	}
	checkin := strings.TrimSpace(c.Query("checkin"))
	checkout := strings.TrimSpace(c.Query("checkout"))

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	rooms, err := h.roomService.SearchRooms(ctx, city, guests, checkin, checkout)
	if err != nil {
		if errors.Is(err, erors.ErrInvalidInput) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rooms)
}
