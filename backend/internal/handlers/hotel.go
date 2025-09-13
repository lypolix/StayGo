package handlers

import (
	"backend/internal/models"
	"backend/internal/services"
	"context"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

type HotelHandler struct {
	hotelServ services.HotelServiceInterface
}

func NewHotelHandler(hotelServ services.HotelServiceInterface) *HotelHandler {
	return &HotelHandler{hotelServ: hotelServ}
}

func (h *HotelHandler) Create(c *gin.Context) {
	role, exists := c.Get("role")
	if !exists || role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	var hotel models.Hotel
	if err := c.ShouldBindJSON(&hotel); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверные параметры"})
		return
	}
	if err := h.hotelServ.CreateHotel(ctx, hotel); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Внутренняя ошибка сервера"})
		return
	}
	c.JSON(http.StatusCreated, hotel)
}
