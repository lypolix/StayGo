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

func (h *HotelHandler) List(c *gin.Context) {
    // Логика получения списка отелей из сервиса
    hotels, err := h.hotelServ.GetAll(c)
    if err != nil {
        c.JSON(500, gin.H{"error": "Failed to get hotels"})
        return
    }
    c.JSON(200, hotels)
}


func (h *HotelHandler) GetByID(c *gin.Context) {
    idParam := c.Param("hotel_id")
    hotelID, err := strconv.ParseInt(idParam, 10, 64)
    if err != nil {
        c.JSON(400, gin.H{"error": "invalid hotel_id"})
        return
    }

    hotel, err := h.hotelServ.GetByID(c.Request.Context(), hotelID)
    if err != nil {
        c.JSON(404, gin.H{"error": "hotel not found"})
        return
    }
    c.JSON(200, hotel)
}

