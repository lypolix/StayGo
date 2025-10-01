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

// Create создание отеля (admin)
// @Summary Создать отель
// @Tags hotels
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param input body models.Hotel true "Данные отеля"
// @Success 201 {object} models.Hotel
// @Failure 400 {object} map[string]string "Неверные данные запроса"
// @Failure 403 {object} map[string]string "Access denied"
// @Failure 500 {object} map[string]string "failed to create hotel"
// @Router /hotels [post]
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

// List список всех отелей
// @Summary Получить список всех отелей
// @Tags hotels
// @Produce json
// @Success 200 {array} models.Hotel
// @Failure 500 {object} map[string]string "Failed to get hotels"
// @Router /hotels [get]
func (h HotelHandler) List(c *gin.Context) {
	hotels, err := h.hotelServ.GetAll(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get hotels"})
		return
	}
	c.JSON(http.StatusOK, hotels)
}

// GetByID получить отель по ID
// @Summary Получить отель по ID
// @Tags hotels
// @Produce json
// @Param hotelid path int true "ID отеля"
// @Success 200 {object} models.Hotel
// @Failure 400 {object} map[string]string "invalid hotelid"
// @Failure 404 {object} map[string]string "hotel not found"
// @Router /hotels/{hotelid} [get]
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

// ListByCity список отелей по городу
// @Summary Получить список отелей по городу
// @Tags hotels
// @Produce json
// @Param city query string true "Название города"
// @Success 200 {array} models.Hotel
// @Failure 400 {object} map[string]string "city query parameter is required | invalid input"
// @Failure 500 {object} map[string]string "internal error"
// @Router /hotels/search [get]
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
