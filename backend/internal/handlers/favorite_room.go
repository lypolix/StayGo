package handlers

import (
	"backend/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type FavoriteRoomHandler struct {
    service services.FavoriteRoomService
}

func NewFavoriteRoomHandler(service services.FavoriteRoomService) *FavoriteRoomHandler {
    return &FavoriteRoomHandler{service: service}
}

// Добавить комнату в избранное
func (h *FavoriteRoomHandler) Add(c *gin.Context) {
    userID, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "user authorization required"})
        return
    }

    var input struct {
        RoomID int64 `json:"room_id"`
    }
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
        return
    }

    if err := h.service.AddToFavorites(c.Request.Context(), userID.(int64), input.RoomID); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot add to favorites"})
        return
    }

    c.Status(http.StatusNoContent)
}

// Удалить комнату из избранного
func (h *FavoriteRoomHandler) Remove(c *gin.Context) {
    userID, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "user authorization required"})
        return
    }

    roomIDStr := c.Param("room_id")
    roomID, err := strconv.ParseInt(roomIDStr, 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid room_id"})
        return
    }

    if err := h.service.RemoveFromFavorites(c.Request.Context(), userID.(int64), roomID); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot remove from favorites"})
        return
    }

    c.Status(http.StatusNoContent)
}


// Получить список избранных комнат пользователя
func (h *FavoriteRoomHandler) List(c *gin.Context) {
    userID, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "user authorization required"})
        return
    }

    rooms, err := h.service.GetFavorites(c.Request.Context(), userID.(int64))
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot fetch favorites"})
        return
    }

    c.JSON(http.StatusOK, rooms)
}
