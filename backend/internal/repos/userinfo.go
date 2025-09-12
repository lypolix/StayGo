package repos

import (
	"backend/internal/models"
	"context"
	"database/sql"
	"errors"
	"fmt"
)

type UserRepoInterface interface {
	GetUserInfo(ctx context.Context, userID int64) (models.User, error)
	UpdateUserInfo(ctx context.Context, user models.User) error
}

type userInfoRepo struct {
	DB *sql.DB
}

func NewUserInfoRepo(db *sql.DB) UserRepoInterface {
	return &userInfoRepo{
		DB: db,
	}
}

func (r *userInfoRepo) GetUserInfo(ctx context.Context, userID int64) (models.User, error) {
	var user models.User

	row := r.DB.QueryRowContext(
		ctx, `SELECT name, email, created_at, date_of_birth, city FROM users WHERE id = $1`, userID)

	err := row.Scan(
		&user.Name,
		&user.Email,
		&user.CreatedAt,
		&user.DateOfBirth,
		&user.City)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) { // если юзера нет
			return models.User{}, err
		}
		return models.User{}, err
	}

	return user, nil
}

func (r *userInfoRepo) UpdateUserInfo(ctx context.Context, user models.User) error {
	result, err := r.DB.ExecContext(ctx,
		`UPDATE users 
         SET name = $1, email = $2, city = $3 
         WHERE id = $4`,
		user.Name, user.Email, user.City, user.ID,
	)
	if err != nil {
		return fmt.Errorf("failed to update user info: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("user with ID %d not found", user.ID)
	}

	return nil
}
