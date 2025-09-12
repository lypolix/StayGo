package handlers

import (
	"backend/internal/erors"
	"backend/internal/models"
	"backend/internal/services"
	"context"
	"errors"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

type UserHandler struct {
	userServ services.UserServInterface
}

func NewUserHandler(userServ services.UserServInterface) *UserHandler {
	return &UserHandler{userServ: userServ}
}

func (u *UserHandler) GetUserInfo(c *gin.Context) {
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
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}

	c.JSON(http.StatusOK, user)
}

func (u *UserHandler) UpdateUserInfo(c *gin.Context) {
	userID, err := getUserId(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user authentication required"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	var inputUserInfo models.UserUpdateDTO

	if err := c.ShouldBindJSON(&inputUserInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON format"})
		return
	}

	inputUserInfo.ID = userID

	err = u.userServ.UpdateUserInfo(ctx, inputUserInfo)
	if err != nil {
		if errors.Is(err, erors.ErrUserNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "user updated successfully"})
}

func getUserId(c *gin.Context) (int64, error) {
	id, ok := c.Get("user_id")
	if !ok {
		return 0, errors.New("user id not found")
	}

	idInt, ok := id.(int64)
	if !ok {
		return 0, errors.New("user id is not int64")
	}

	return idInt, nil
}
