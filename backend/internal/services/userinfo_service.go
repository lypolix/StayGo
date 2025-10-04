package services

import (
	"context"
	"errors"
	"strings"

	"backend/internal/erors"
	"backend/internal/models"
	"backend/internal/repos"
)

type userInfoServ struct {
	userRepo repos.UserRepoInterface
}

type UserServInterface interface {
	GetUserInfo(ctx context.Context, userID int64) (models.UserInfoDTO, error)
	UpdateUserInfo(ctx context.Context, user models.UserUpdateDTO) error
}

func NewUserInfoServ(userServ repos.UserRepoInterface) UserServInterface {
	return &userInfoServ{
		userRepo: userServ,
	}
}

func (u *userInfoServ) GetUserInfo(ctx context.Context, userID int64) (models.UserInfoDTO, error) {
	res, err := u.userRepo.GetUserInfo(ctx, userID)
	if err != nil {
		// Предполагается, что репозиторий возвращает erors.ErrUserNotFound при отсутствии
		if errors.Is(err, erors.ErrUserNotFound) {
			return models.UserInfoDTO{}, erors.ErrUserNotFound
		}
		return models.UserInfoDTO{}, err
	}

	user := models.UserInfoDTO{
		Name:        res.Name,
		City:        res.City,
		Email:       res.Email,
		DateOfBirth: res.DateOfBirth,
		CreatedAt:   res.CreatedAt,
	}
	return user, nil
}

func (u *userInfoServ) UpdateUserInfo(ctx context.Context, user models.UserUpdateDTO) error {
	// Минимальная валидация: нужны поля для обновления
	if strings.TrimSpace(user.Name) == "" &&
		strings.TrimSpace(user.Email) == "" &&
		strings.TrimSpace(user.City) == "" {
		return erors.ErrInvalidInput
	}

	userInfo := models.User{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
		City:  user.City,
	}

	if err := u.userRepo.UpdateUserInfo(ctx, userInfo); err != nil {
		// Сценарий: пользователь не найден
		if errors.Is(err, erors.ErrUserNotFound) {
			return erors.ErrUserNotFound
		}
		// Сценарий: конфликт уникальности email (рекомендуется, чтобы репозиторий маппил драйверную ошибку)
		if errors.Is(err, erors.ErrEmailTaken) {
			return erors.ErrEmailTaken
		}
		return err
	}

	return nil
}
