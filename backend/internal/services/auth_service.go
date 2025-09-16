package services

import (
    "backend/internal/config"
    "backend/internal/models"
    "backend/internal/repos"
    "backend/internal/logger"
    "context"
    "errors"

    "go.uber.org/zap"
    "golang.org/x/crypto/bcrypt"
)


type authService struct {
    config   *config.Config
    authRepo repos.AuthRepoInterface
    logger   logger.Logger
}

type AuthServiceInterface interface {
    RegisterUser(ctx context.Context, user models.CreateUserDTO) (int64, error)
    LoginUser(ctx context.Context, email, password string) (models.User, error)
}

func NewAuthService(cfg *config.Config, authRepo repos.AuthRepoInterface, logger logger.Logger) AuthServiceInterface {
    return &authService{
        config:   cfg,
        authRepo: authRepo,
        logger:   logger,
    }
}

// RegisterUser регистрирует нового пользователя с хешированием пароля
func (a *authService) RegisterUser(ctx context.Context, dto models.CreateUserDTO) (int64, error) {
    hashedPassword, err := HashPassword(dto.Password)
    if err != nil {
        a.logger.Error("failed to hash password", zap.Error(err))
        return 0, err
    }

    userToCreate := models.CreateUserDTO{
        Name:        dto.Name,
        Email:       dto.Email,
        Password:    hashedPassword,
        City:        dto.City,
        DateOfBirth: dto.DateOfBirth,
        Role:        dto.Role,  // Передаем роль здесь
    }

    id, err := a.authRepo.CreateUser(ctx, userToCreate)
    if err != nil {
        a.logger.Error("failed to create user", zap.Error(err), zap.String("email", dto.Email))
        return 0, err
    }

    a.logger.Info("user registered successfully", zap.String("email", dto.Email), zap.Int64("userID", id))
    return id, nil
}


// LoginUser ищет пользователя по email и проверяет пароль
func (a *authService) LoginUser(ctx context.Context, email, password string) (models.User, error) {
    user, err := a.authRepo.GetUserByEmail(ctx, email)
    if err != nil {
        a.logger.Warn("login failed: user not found", zap.String("email", email), zap.Error(err))
        return models.User{}, errors.New("invalid credentials")
    }

    a.logger.Info("attempt login",
        zap.String("email", email),
        zap.String("dbPasswordHash", user.Password),
        zap.String("inputPassword", password), // временно для отладки, потом убрать
    )

    if !CheckPasswordHash(password, user.Password) {
        a.logger.Warn("login failed: password mismatch", zap.String("email", email))
        return models.User{}, errors.New("invalid credentials")
    }

    a.logger.Info("user logged in successfully", zap.String("email", email))
    return user, nil
}

// HashPassword создает хэш пароля с помощью bcrypt
func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    return string(bytes), err
}

// CheckPasswordHash сравнивает пароль и хэш
func CheckPasswordHash(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}
