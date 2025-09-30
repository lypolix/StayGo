package erors

import "errors"

var (
	// Пользователи
	ErrUserAlreadyExists  = errors.New("user already exists")
	ErrUserNotFound       = errors.New("user not found")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrEmailTaken         = errors.New("email already taken")

	// Общие
	ErrInvalidInput = errors.New("invalid input")
	ErrForbidden    = errors.New("forbidden")
	ErrUnauthorized = errors.New("unauthorized")
	ErrNotFound     = errors.New("not found")
	ErrConflict     = errors.New("conflict")

	// Домены комнат/отелей
	ErrInvalidHotelID = errors.New("invalid hotel id")
)
