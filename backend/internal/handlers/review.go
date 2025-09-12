package handlers

import (
    "net/http"
    "strconv"
    "backend/internal/repos"
    "backend/internal/models"

    "github.com/gin-gonic/gin"
)

type ReviewHandler struct {
    Repo *repos.ReviewRepo
}

func NewReviewHandler(repo *repos.ReviewRepo) *ReviewHandler {
    return &ReviewHandler{Repo: repo}
}

func (h *ReviewHandler) Create(c *gin.Context) {
    var review models.Review
    if err := c.ShouldBindJSON(&review); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    if err := h.Repo.Create(&review); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, review)
}

func (h *ReviewHandler) List(c *gin.Context) {
    roomID, err := strconv.ParseInt(c.Query("room_id"), 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid room_id"})
        return
    }
    reviews, err := h.Repo.List(roomID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, reviews)
}
