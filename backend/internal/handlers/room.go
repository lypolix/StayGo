package handlers

import (
	"backend/internal/models"
	"backend/internal/services"
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// RoomHandler реализует обработчики для работы с комнатами
type RoomHandler struct {
    roomService services.RoomServiceInterface
}

// NewRoomHandler создает новый экземпляр RoomHandler
func NewRoomHandler(service services.RoomServiceInterface) *RoomHandler {
    return &RoomHandler{
        roomService: service,
    }
}

// Create создает новую комнату, только для админов
func (h *RoomHandler) Create(c *gin.Context) {
    role, exists := c.Get("role")
    if !exists || role != "admin" {
        c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
        return
    }

    var room models.Room
    if err := c.ShouldBindJSON(&room); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid parameters"})
        return
    }

    ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
    defer cancel()

    err := h.roomService.CreateRoom(ctx, room)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
        return
    }

    c.JSON(http.StatusCreated, room)
}

// ListByHotel возвращает список комнат по отелю
func (h *RoomHandler) ListByHotel(c *gin.Context) {
    hotelIDStr := c.Param("hotel_id")
    hotelID, err := strconv.ParseInt(hotelIDStr, 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid hotel id"})
        return
    }

    rooms, err := h.roomService.ListByHotel(c.Request.Context(), hotelID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get rooms"})
        return
    }

    c.JSON(http.StatusOK, rooms)
}

func (h *RoomHandler) GetByID(c *gin.Context) {
    roomIDStr := c.Param("room_id")
    roomID, err := strconv.ParseInt(roomIDStr, 10, 64)
    if err != nil {
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