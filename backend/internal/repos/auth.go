package repos

import (
	"backend/internal/erors"
	"backend/internal/models"
	"context"
	"database/sql"
	"errors"
	"github.com/lib/pq"
)

type authRepo struct {
	db *sql.DB
}

type AuthRepoInterface interface {
	CreateUser(ctx context.Context, user models.CreateUserDTO) (int64, error)
	GetUserByEmail(ctx context.Context, email string) (models.User, error)

}

func NewAuthRepo(db *sql.DB) AuthRepoInterface {
	return &authRepo{
		db: db,
	}
}

func (r *authRepo) CreateUser(ctx context.Context, user models.CreateUserDTO) (int64, error) {
    var ID int64

    err := r.db.QueryRowContext(
        ctx, `INSERT INTO users (name, email, password, city, date_of_birth, role)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        user.Name, user.Email, user.Password, user.City, user.DateOfBirth, user.Role,
    ).Scan(&ID)

    if err != nil {
        var pqErr *pq.Error
        if errors.As(err, &pqErr) && pqErr.Code == "23505" {
            return 0, erors.ErrUserAlreadyExists
        }
        return 0, err
    }

    return ID, nil
}



func (r *authRepo) GetUserByEmail(ctx context.Context, email string) (models.User, error) {
    var user models.User
    err := r.db.QueryRowContext(
        ctx,
        `SELECT id, name, email, password, date_of_birth, created_at, city, role, refresh 
         FROM users WHERE email = $1`,
        email,
    ).Scan(
        &user.ID,
        &user.Name,
        &user.Email,
        &user.Password,
        &user.DateOfBirth,
        &user.CreatedAt,
        &user.City,
        &user.Role,
        &user.Refresh,
    )
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return user, erors.ErrInvalidCredentials
        }
        return user, err
    }
    return user, nil
}
