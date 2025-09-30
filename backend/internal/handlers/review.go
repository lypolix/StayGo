package handlers

import (
	"net/http"
	"strconv"

	"backend/internal/models"
	"backend/internal/repos"
	"github.com/gin-gonic/gin"
)

type ReviewHandler struct {
	Repo repos.ReviewRepo
}

func NewReviewHandler(repo repos.ReviewRepo) ReviewHandler {
	return ReviewHandler{Repo: repo}
}

func (h ReviewHandler) Create(c *gin.Context) {
	var review models.Review
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIDVal, exists := c.Get("userid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := userIDVal.(int64)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	review.UserID = userID

	if err := h.Repo.Create(&review); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, review)
}

func (h ReviewHandler) List(c *gin.Context) {
	roomIDStr := c.Query("roomid")
	if roomIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "roomid query parameter is required"})
		return
	}
	roomID, err := strconv.ParseInt(roomIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid roomid"})
		return
	}

	reviews, err := h.Repo.List(roomID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, reviews)
}
