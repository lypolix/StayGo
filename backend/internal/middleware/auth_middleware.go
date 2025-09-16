package middleware

import (
	"log"
	"net/http"
	"strings"

	"backend/internal/services"

	"github.com/gin-gonic/gin"
)

type AuthMiddleware struct {
    jwtService *services.JWTService
}

func NewAuthMiddleware(jwtService *services.JWTService) *AuthMiddleware {
    return &AuthMiddleware{jwtService: jwtService}
}

func (m *AuthMiddleware) RequireAuth() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        tokenParts := strings.Split(authHeader, " ")
        if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
            c.Abort()
            return
        }

        claims, err := m.jwtService.ValidateToken(tokenParts[1])
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        role := claims.Role
        if role == "" {
            role = "unknown"
        }
        log.Printf("[AuthMiddleware] User role from token: %s", role)

        c.Set("user_id", claims.UserID)
        c.Set("user_email", claims.Email)
        c.Set("userRole", role)  // единый ключ роли

        c.Next()
    }
}
