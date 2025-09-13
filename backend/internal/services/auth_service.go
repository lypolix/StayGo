package services

import (
	"backend/internal/config"
	"backend/internal/models"
	"backend/internal/repos"
	"context"
	"errors"
	"golang.org/x/crypto/bcrypt"
)

type authService struct {
	config   *config.Config
	authRepo repos.AuthRepoInterface
}

type AuthServiceInterface interface {
	RegisterUser(ctx context.Context, user models.CreateUserDTO) (int64, error)
	LoginUser(ctx context.Context, email, password string) (models.User, error)
}

func NewAuthService(cfg *config.Config, authRepo repos.AuthRepoInterface) AuthServiceInterface {
	return &authService{
		config:   cfg,
		authRepo: authRepo,
	}
}

// RegisterUser регистрация пользователя (с хэшем)
func (a *authService) RegisterUser(ctx context.Context, dto models.CreateUserDTO) (int64, error) {
	hashedPassword, err := HashPassword(dto.Password)
	if err != nil {
		return 0, err
	}

	userToCreate := models.CreateUserDTO{
		Name:        dto.Name,
		Email:       dto.Email,
		Password:    hashedPassword,
		City:        dto.City,
		DateOfBirth: dto.DateOfBirth,
	}

	return a.authRepo.CreateUser(ctx, userToCreate)
}

// LoginUser получение пользователя и сравнение пароля для логина
func (a *authService) LoginUser(ctx context.Context, email, password string) (models.User, error) {
	userDTO := models.LoginUserDTO{
		Email:    email,
		Password: password,
	}

	user, err := a.authRepo.GetUserByCreeds(ctx, userDTO)
	if err != nil {
		return models.User{}, errors.New("invalid credentials")
	}

	if !CheckPasswordHash(password, user.Password) {
		return models.User{}, errors.New("invalid password")
	}

	return user, nil
}

// HashPassword создаёт хэш пароля
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPasswordHash сверяет пароль и хэш
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
