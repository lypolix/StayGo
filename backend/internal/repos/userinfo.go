package repos

import (
	"backend/internal/erors"
	"backend/internal/models"
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/lib/pq"
)

type UserRepoInterface interface {
	GetUserInfo(ctx context.Context, userID int64) (models.User, error)
	UpdateUserInfo(ctx context.Context, user models.User) error
}

type userInfoRepo struct {
	DB *sql.DB
}

func NewUserInfoRepo(db *sql.DB) UserRepoInterface {
	return &userInfoRepo{DB: db}
}

func (r *userInfoRepo) GetUserInfo(ctx context.Context, userID int64) (models.User, error) {
	var user models.User

	row := r.DB.QueryRowContext(
		ctx,
		`SELECT name, email, created_at, date_of_birth, city FROM users WHERE id = $1`,
		userID,
	)

	if err := row.Scan(
		&user.Name,
		&user.Email,
		&user.CreatedAt,
		&user.DateOfBirth,
		&user.City,
	); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return models.User{}, erors.ErrUserNotFound
		}
		return models.User{}, fmt.Errorf("scan user: %w", err)
	}

	return user, nil
}

func (r *userInfoRepo) UpdateUserInfo(ctx context.Context, user models.User) error {
	result, err := r.DB.ExecContext(
		ctx,
		`UPDATE users 
         SET name = $1, email = $2, city = $3 
         WHERE id = $4`,
		user.Name, user.Email, user.City, user.ID,
	)
	if err != nil {
		// Детектируем конфликт уникальности email (PostgreSQL code 23505)
		var pqErr *pq.Error
		if errors.As(err, &pqErr) && pqErr.Code == "23505" {
			return erors.ErrEmailTaken
		}
		return fmt.Errorf("update user: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("rows affected: %w", err)
	}
	if rows == 0 {
		return erors.ErrUserNotFound
	}

	return nil
}
