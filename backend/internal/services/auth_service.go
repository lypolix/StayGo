package services

import (
    "backend/internal/config"
    "backend/internal/models"
    "errors"
    "golang.org/x/crypto/bcrypt"
    "sync"
    "time"
)

type AuthService struct {
    config *config.Config
    // Временно для примера храним пользователей в памяти
    users map[string]*models.User
    mu    sync.RWMutex
}

func NewAuthService(cfg *config.Config) *AuthService {
    return &AuthService{
        config: cfg,
        users:  make(map[string]*models.User),
    }
}

// RegisterUser создаёт и сохраняет пользователя (с хэшом пароля)
func (a *AuthService) RegisterUser(name, email, password, city, dob string, role string) (*models.User, error) {
    a.mu.Lock()
    defer a.mu.Unlock()

    if _, exists := a.users[email]; exists {
        return nil, errors.New("user already exists")
    }

    hashedPassword, err := HashPassword(password)
    if err != nil {
        return nil, err
    }

    user := &models.User{
        ID:          time.Now().UnixNano(), // пример генерации ID
        Name:        name,
        Email:       email,
        Password:    hashedPassword,
        City:        city,
        Role:        role,
        DateOfBirth: dob,
        CreatedAt:   time.Now().Format("2006-01-02 15:04:05"),
    }

    a.users[email] = user

    return user, nil
}

// GetUserByEmail ищет пользователя по email
func (a *AuthService) GetUserByEmail(email string) (*models.User, error) {
    a.mu.RLock()
    defer a.mu.RUnlock()

    user, exists := a.users[email]
    if !exists {
        return nil, nil // не найден
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
