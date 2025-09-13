package erors

import "errors"

var (
	ErrUserAlreadyExists = errors.New("user already exists")
	ErrUserNotFound      = errors.New("user not found")
)

var (
	ErrInvalidCredentials = errors.New("invalid creeds")
)
