package models

type CreateUserDTO struct {
	Name        string `db:"name" json:"name"`
	Email       string `db:"email" json:"email"`
	Password    string `db:"password" json:"password"`
	DateOfBirth string `db:"date_of_birth" json:"date_of_birth"`
	City        string `db:"city" json:"city"`
	Role        string `json:"role"`
}

// LoginUserDTO поля для логина (надо не забыть перенести в handlers)
type LoginUserDTO struct {
	Email    string `db:"email" json:"email"`
	Password string `db:"password" json:"password"`
}

// AuthResponse поля получения ответа (надо не забыть перенести в handlers)
type AuthResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}
