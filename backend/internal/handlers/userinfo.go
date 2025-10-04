package handlers

import (
	"context"
	"errors"
	"net/http"
	"strings"
	"time"

	"backend/internal/erors"
	"backend/internal/models"
	"backend/internal/services"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userServ services.UserServInterface
}

func NewUserHandler(userServ services.UserServInterface) UserHandler {
	return UserHandler{userServ: userServ}
}

func getUserId(c *gin.Context) (int64, error) {
	v, ok := c.Get("userid")
	if !ok {
		return 0, errors.New("no user in context")
	}
	id, ok := v.(int64)
	if !ok || id <= 0 {
		return 0, errors.New("invalid user id in context")
	}
	return id, nil
}

// GetUserInfo получить профиль текущего пользователя
// @Summary Получить информацию профиля (текущий пользователь)
// @Tags users
// @Security BearerAuth
// @Produce json
// @Success 200 {object} models.UserInfoDTO
// @Failure 401 {object} map[string]string "user authentication required"
// @Failure 404 {object} map[string]string "user not found"
// @Failure 500 {object} map[string]string "internal server error"
// @Router /users/me [get]
func (u UserHandler) GetUserInfo(c *gin.Context) {
	userID, err := getUserId(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user authentication required"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	user, err := u.userServ.GetUserInfo(ctx, userID)
	if err != nil {
		if errors.Is(err, erors.ErrUserNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// UpdateUserInfo обновить профиль текущего пользователя
// @Summary Обновить информацию профиля (текущий пользователь)
// @Tags users
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param input body models.UserUpdateDTO true "Изменяемые поля"
// @Success 204 "Обновлено"
// @Failure 400 {object} map[string]string "invalid body | no fields to update | invalid input | email already taken"
// @Failure 401 {object} map[string]string "user authentication required"
// @Failure 404 {object} map[string]string "user not found"
// @Failure 500 {object} map[string]string "internal server error"
// @Router /users/me [patch]
func (u UserHandler) UpdateUserInfo(c *gin.Context) {
	userID, err := getUserId(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user authentication required"})
		return
	}

	var dto models.UserUpdateDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
		return
	}

	// Минимальная валидация — должны быть поля для обновления
	if strings.TrimSpace(dto.Name) == "" &&
		strings.TrimSpace(dto.Email) == "" &&
		strings.TrimSpace(dto.City) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no fields to update"})
		return
	}

	dto.ID = userID

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	if err := u.userServ.UpdateUserInfo(ctx, dto); err != nil {
		switch {
		case errors.Is(err, erors.ErrInvalidInput):
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
			return
		case errors.Is(err, erors.ErrEmailTaken):
			c.JSON(http.StatusBadRequest, gin.H{"error": "email already taken"})
			return
		case errors.Is(err, erors.ErrUserNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
	}

	c.Status(http.StatusNoContent)
}
