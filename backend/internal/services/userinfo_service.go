package services

import (
	"backend/internal/models"
	"backend/internal/repos"
	"context"
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
	var user models.UserInfoDTO

	res, err := u.userRepo.GetUserInfo(ctx, userID)
	if err != nil {
		return models.UserInfoDTO{}, err
	}

	user = models.UserInfoDTO{
		Name:        res.Name,
		City:        res.City,
		Email:       res.Email,
		DateOfBirth: res.DateOfBirth,
		CreatedAt:   res.CreatedAt,
	}

	return user, nil
}

func (u *userInfoServ) UpdateUserInfo(ctx context.Context, user models.UserUpdateDTO) error {

	userInfo := models.User{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
		City:  user.City,
	}

	err := u.userRepo.UpdateUserInfo(ctx, userInfo)
	if err != nil {
		return err
	}

	return nil
}
