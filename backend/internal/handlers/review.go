package handlers

import (
	"context"
	"errors"
	"net/http"
	"strconv"
	"time"

	"backend/internal/erors"
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
	// Достаём текущего пользователя из контекста (middleware уже положил его туда)
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

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	reviews, err := h.Repo.ListByUserID(ctx, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	c.JSON(http.StatusOK, reviews)
}


func (h ReviewHandler) DeleteByID(c *gin.Context) {
	// Проверка роли
	roleVal, exists := c.Get("userRole")
	role, ok := roleVal.(string)
	if !exists || !ok || role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
		return
	}

	// Парсинг id
	idStr := c.Param("id")
	reviewID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || reviewID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid review id"})
		return
	}

	// Контекст с таймаутом
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	// Вызов сервиса
	if err := h.Repo.DeleteByID(ctx, reviewID); err != nil {
		switch {
		case errors.Is(err, erors.ErrInvalidInput):
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
			return
		case errors.Is(err, erors.ErrNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "review not found"})
			return
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
	}

	c.Status(http.StatusNoContent)
}


func (h ReviewHandler) ListByRoomID(c *gin.Context) {
	// Имя path-параметра должно совпадать с роутом: ":roomid"
	roomIDStr := c.Param("roomid")
	roomID, err := strconv.ParseInt(roomIDStr, 10, 64)
	if err != nil || roomID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid room id"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	reviews, err := h.Repo.ListByRoomID(ctx, roomID)
	if err != nil {
		switch {
		case errors.Is(err, erors.ErrInvalidInput):
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}

	// Возвращаем все отзывы (свои и чужие) по комнате
	c.JSON(http.StatusOK, reviews)
}