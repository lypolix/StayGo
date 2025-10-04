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

// Add добавить комнату в избранное
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

// Remove убрать комнату из избранного
// @Summary Удалить комнату из избранного
// @Tags favorites
// @Security BearerAuth
// @Produce json
// @Param roomid path int true "ID комнаты"
// @Success 204 "Удалено"
// @Failure 400 {object} map[string]string "invalid roomid"
// @Failure 401 {object} map[string]string "user authorization required"
// @Failure 500 {object} map[string]string "failed to remove favorite"
// @Router /favorites/{roomid} [delete]
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

// List список избранных комнат пользователя
// @Summary Получить список избранных комнат текущего пользователя
// @Tags favorites
// @Security BearerAuth
// @Produce json
// @Success 200 {array} int64 "Список ID комнат"
// @Failure 401 {object} map[string]string "user authorization required"
// @Failure 500 {object} map[string]string "failed to list favorites"
// @Router /favorites [get]
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
