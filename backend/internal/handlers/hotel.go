package handlers

import (
	"backend/internal/erors"
	"backend/internal/models"
	"backend/internal/services"
	"context"
	"errors"
	"strings"

	"net/http"
	"strconv"

	"time"

	"github.com/gin-gonic/gin"
)

type HotelHandler struct {
	hotelServ services.HotelServiceInterface
}

func NewHotelHandler(hotelServ services.HotelServiceInterface) HotelHandler {
	return HotelHandler{hotelServ: hotelServ}
}

func (h HotelHandler) Create(c *gin.Context) {
	roleVal, exists := c.Get("userRole")
	role, ok := roleVal.(string)
	if !exists || !ok || role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	var hotel models.Hotel
	if err := c.ShouldBindJSON(&hotel); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.hotelServ.CreateHotel(ctx, &hotel); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create hotel"})
		return
	}

	c.JSON(http.StatusCreated, hotel)
}

func (h HotelHandler) List(c *gin.Context) {
	hotels, err := h.hotelServ.GetAll(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get hotels"})
		return
	}
	c.JSON(http.StatusOK, hotels)
}

func (h HotelHandler) GetByID(c *gin.Context) {
	idParam := c.Param("hotelid")
	hotelID, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid hotelid"})
		return
	}

	hotel, err := h.hotelServ.GetByID(c.Request.Context(), hotelID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "hotel not found"})
		return
	}

	c.JSON(http.StatusOK, hotel)
}

func (h HotelHandler) ListByCity(c *gin.Context) {
    city := c.Query("city")
    if strings.TrimSpace(city) == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "city query parameter is required"})
        return
    }

    ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
    defer cancel()

    hotels, err := h.hotelServ.ListByCity(ctx, city)
    if err != nil {
        switch {
        case errors.Is(err, erors.ErrInvalidInput):
            c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
        default:
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        }
        return
    }
    c.JSON(http.StatusOK, hotels)
}



