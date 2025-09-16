package handlers

import (
	"backend/internal/erors"
	"backend/internal/models"
	"backend/internal/services"
	"context"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService services.AuthServiceInterface
	jwtService  *services.JWTService
}

func NewAuthHandler(authService services.AuthServiceInterface, jwtService *services.JWTService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		jwtService:  jwtService,
	}
}

// Register обработчик регистрации
func (h *AuthHandler) Register(c *gin.Context) {
	var input models.CreateUserDTO

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверные данные запроса"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	userDTO := models.CreateUserDTO{
		Name:        input.Name,
		Email:       input.Email,
		Password:    input.Password,
		City:        input.City,
		DateOfBirth: input.DateOfBirth,
		Role:        input.Role, 
	}

	id, err := h.authService.RegisterUser(ctx, userDTO)
	if err != nil {
		if errors.Is(err, erors.ErrUserAlreadyExists) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Пользователь уже существует"})
		}
		return
	}

	c.JSON(http.StatusCreated, id)
}

// Login обработчик входа
func (h *AuthHandler) Login(c *gin.Context) {
    var input models.LoginUserDTO

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Неверные данные запроса"})
        return
    }

    ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
    defer cancel()

    user, err := h.authService.LoginUser(ctx, input.Email, input.Password)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Неверные учетные данные"})
        return
    }

    log.Printf("User role: %s", user.Role)

    accessToken, refreshToken, err := h.jwtService.GenerateTokenPair(&user)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Внутренняя ошибка сервера"})
        return
    }

    response := models.AuthResponse{
        AccessToken:  accessToken,
        RefreshToken: refreshToken,
    }

    c.JSON(http.StatusOK, response)
}
