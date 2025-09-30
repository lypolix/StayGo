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
			c.JSON(http.StatusInternalServerError,  gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusCreated, room)
}

func (h RoomHandler) ListByHotel(c *gin.Context) {
	hotelIDStr := c.Param("hotel_id")
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
		c.JSON(http.StatusInternalServerError,  gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rooms)
}

