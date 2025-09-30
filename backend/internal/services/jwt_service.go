package services

import (
	"errors"
	"time"

	"backend/internal/config"
	"backend/internal/models"
	"github.com/golang-jwt/jwt/v4"
)

type JWTService struct {
	config config.Config
}

type Claims struct {
	UserID int64  `json:"userid"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

func NewJWTService(cfg config.Config) JWTService {
	return JWTService{config: cfg}
}

func (j JWTService) GenerateTokenPair(user models.User) (string, string, error) {
	now := time.Now()

	accessClaims := Claims{
		UserID: user.ID,
		Email:  user.Email,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(time.Duration(j.config.JWT.AccessTokenTTL) * time.Second)),
			IssuedAt:  jwt.NewNumericDate(now),
		},
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessString, err := accessToken.SignedString([]byte(j.config.JWT.Secret))
	if err != nil {
		return "", "", err
	}

	refreshClaims := Claims{
		UserID: user.ID,
		Email:  user.Email,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(time.Duration(j.config.JWT.RefreshTokenTTL) * time.Second)),
			IssuedAt:  jwt.NewNumericDate(now),
		},
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshString, err := refreshToken.SignedString([]byte(j.config.JWT.Secret))
	if err != nil {
		return "", "", err
	}

	return accessString, refreshString, nil
}

func (j JWTService) ValidateToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(j.config.JWT.Secret), nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("invalid token")
}
