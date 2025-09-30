package handlers

import (
	"net/http"
	"strconv"

	"backend/internal/models"
	"backend/internal/services"
	"github.com/gin-gonic/gin"
)

type FavoriteRoomHandler struct {
	service services.FavoriteRoomService
}

func NewFavoriteRoomHandler(service services.FavoriteRoomService) FavoriteRoomHandler {
	return FavoriteRoomHandler{service: service}
}

func (h FavoriteRoomHandler) Add(c *gin.Context) {
	userIDVal, exists := c.Get("userid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user authorization required"})
		return
	}
	userID, ok := userIDVal.(int64)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user authorization required"})
		return
	}

	var body models.FavoriteRoomDTO
	if err := c.ShouldBindJSON(&body); err != nil || body.RoomID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
		return
	}

	if err := h.service.AddToFavorites(c, userID, body.RoomID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add favorite"})
		return
	}
	c.Status(http.StatusCreated)
}

func (h FavoriteRoomHandler) Remove(c *gin.Context) {
	userIDVal, exists := c.Get("userid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user authorization required"})
		return
	}
	userID, ok := userIDVal.(int64)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user authorization required"})
		return
	}

	roomID, err := strconv.ParseInt(c.Param("roomid"), 10, 64)
	if err != nil || roomID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid roomid"})
		return
	}

	if err := h.service.RemoveFromFavorites(c, userID, roomID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to remove favorite"})
		return
	}
	c.Status(http.StatusNoContent)
}

func (h FavoriteRoomHandler) List(c *gin.Context) {
	userIDVal, exists := c.Get("userid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user authorization required"})
		return
	}
	userID, ok := userIDVal.(int64)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user authorization required"})
		return
	}

	items, err := h.service.GetFavorites(c, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list favorites"})
		return
	}
	c.JSON(http.StatusOK, items)
}
