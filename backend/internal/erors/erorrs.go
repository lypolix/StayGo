package erors

import "errors"

var (
	ErrEmailAlreadyExists = errors.New("email already exists")
	ErrUserNotFound       = errors.New("user not found")
	ErrEmptyInput         = errors.New("input len is null")
)

var (
	ErrorInternalServer = errors.New("internal error")
)
