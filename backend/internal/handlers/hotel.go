package handlers

import (
    "net/http"
    "backend/internal/repos"
    "backend/internal/models"
    "github.com/gin-gonic/gin"
)

type HotelHandler struct {
    Repo *repos.HotelRepo
}

func NewHotelHandler(repo *repos.HotelRepo) *HotelHandler {
    return &HotelHandler{Repo: repo}
}

func (h *HotelHandler) Create(c *gin.Context) {
    role, exists := c.Get("role")
    if !exists || role != "admin" {
        c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
        return
    }
    var hotel models.Hotel
    if err := c.ShouldBindJSON(&hotel); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    if err := h.Repo.Create(&hotel); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, hotel)
}
