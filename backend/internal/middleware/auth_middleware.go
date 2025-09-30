package middleware

import (
	"log"
	"net/http"
	"strings"

	"backend/internal/services"
	"github.com/gin-gonic/gin"
)

const (
	ctxUserIDKey = "userid"
	ctxUserRole  = "userRole"
	ctxUserEmail = "useremail"
)

type AuthMiddleware struct {
	jwtService services.JWTService
}

func NewAuthMiddleware(jwtService services.JWTService) AuthMiddleware {
	return AuthMiddleware{jwtService: jwtService}
}

func (m AuthMiddleware) RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") || strings.TrimSpace(parts[1]) == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}
		token := strings.TrimSpace(parts[1])

		claims, err := m.jwtService.ValidateToken(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		role := claims.Role
		if role == "" {
			role = "unknown"
			log.Printf("AuthMiddleware: empty role, defaulting to %q", role)
		}

		c.Set(ctxUserIDKey, claims.UserID)
		c.Set(ctxUserEmail, claims.Email)
		c.Set(ctxUserRole, role)

		c.Next()
	}
}
