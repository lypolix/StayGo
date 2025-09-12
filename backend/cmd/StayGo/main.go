package main

import (
	"backend/internal/config"
	"backend/internal/middleware"
	"backend/internal/models"
	"backend/internal/repos"                
	"backend/internal/services"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    cfg, err := config.LoadConfig()
    if err != nil {
        log.Fatalf("could not load config: %v", err)
    }

    db, err := config.InitDB(cfg.Database)
    if err != nil {
        log.Fatalf("could not connect to db: %v", err)
    }
    

    jwtService := services.NewJWTService(cfg)
    authService := services.NewAuthService(cfg)
    authMiddleware := middleware.NewAuthMiddleware(jwtService)
    hotelRepo := repos.NewHotelRepo(db) 

    r.POST("/register", func(c *gin.Context) {
        var req models.User 
        if err := c.ShouldBindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
            return
        }
    
        adminEmails := map[string]bool{
            "admin@example.com": true,
            "admin1@example.com": true,
            "admin2@example.com": true,
            // добавить email админов
        }
        if _, ok := adminEmails[req.Email]; !ok || req.Role != "admin" {
            req.Role = "user"
        }
       
        user, err := authService.RegisterUser(req.Name, req.Email, req.Password, req.City, req.DateOfBirth, req.Role)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "registration failed"})
            return
        }
        c.JSON(http.StatusOK, user)
    })
    

    r.POST("/login", func(c *gin.Context) {
        var req struct {
            Email    string `json:"email"`
            Password string `json:"password"`
        }
        if err := c.ShouldBindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
            return
        }
        user, err := authService.GetUserByEmail(req.Email)
        if err != nil || user == nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
            return
        }
        if !services.CheckPasswordHash(req.Password, user.Password) {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
            return
        }

        accessToken, refreshToken, err := jwtService.GenerateTokenPair(user)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "token gen error"})
            return
        }
        c.JSON(http.StatusOK, gin.H{
            "access_token":  accessToken,
            "refresh_token": refreshToken,
        })
    })

    r.GET("/profile", authMiddleware.RequireAuth(), func(c *gin.Context) {
        uid := c.GetInt64("user_id")
        c.JSON(http.StatusOK, gin.H{"user_id": uid})
    })

    r.POST("/hotels", authMiddleware.RequireAuth(), func(c *gin.Context) {
        role := c.GetString("role")
        if role != "admin" {
            c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
            return
        }
        var hotel models.Hotel
        if err := c.ShouldBindJSON(&hotel); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        if err := hotelRepo.Create(&hotel); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusCreated, hotel)
    })

    r.Run(":8080")
}
