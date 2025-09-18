package middleware

import "github.com/gin-gonic/gin"

func СorsMiddleware() gin.HandlerFunc {
	allowedOrigins := map[string]bool{
		"http://localhost:5173": true, // Development (docker-compose)
		"http://localhost:3000": true, // На случай если запустят docker
	}

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if allowedOrigins[origin] {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		}

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
