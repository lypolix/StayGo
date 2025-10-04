package models

// CreateUserDTO входные данные для регистрации пользователя
// @Description Данные, необходимые для создания нового пользователя
type CreateUserDTO struct {
    // Имя пользователя
    // required: true
    Name string `db:"name" json:"name" example:"Alice"`

    // Email пользователя
    // required: true
    Email string `db:"email" json:"email" example:"alice@example.com"`

    // Пароль пользователя (минимум 6 символов)
    // required: true
    Password string `db:"password" json:"password" example:"Passw0rd!"`

    // Дата рождения в формате YYYY-MM-DD
    // required: false
    DateOfBirth string `db:"date_of_birth" json:"date_of_birth" example:"1998-07-15"`

    // Город пользователя
    // required: false
    City string `db:"city" json:"city" example:"Moscow"`

    // Роль пользователя (user/admin)
    // required: false
    Role string `json:"role" example:"user"`
}

// LoginUserDTO входные данные для логина
// @Description Email и пароль для аутентификации
type LoginUserDTO struct {
    // Email пользователя
    // required: true
    Email string `db:"email" json:"email" example:"alice@example.com"`

    // Пароль пользователя
    // required: true
    Password string `db:"password" json:"password" example:"Passw0rd!"`
}

// AuthResponse ответ на успешную аутентификацию
// @Description Пара токенов доступа и обновления
type AuthResponse struct {
    // JWT access token
    AccessToken string `json:"access_token" example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`

    // JWT refresh token
    RefreshToken string `json:"refresh_token" example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
}
