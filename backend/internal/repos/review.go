package repos

import (
	"backend/internal/erors"
	"backend/internal/models"
	"context"
	"database/sql"
	"fmt"
)

type ReviewRepo struct {
    DB *sql.DB
}

func NewReviewRepo(db *sql.DB) *ReviewRepo {
    return &ReviewRepo{DB: db}
}

func (r *ReviewRepo) Create(review *models.Review) error {
    return r.DB.QueryRow(
        `INSERT INTO reviews (room_id, created_at, user_id, description, room_rating, hotel_rating, approved) 
         VALUES ($1, NOW(), $2, $3, $4, $5, $6) RETURNING id`,
        review.RoomID, review.UserID, review.Description, review.RoomRating, review.HotelRating, review.Approved,
    ).Scan(&review.ID)
}


func (r *ReviewRepo) ListByUserID(ctx context.Context, userID int64) ([]models.Review, error) {
	const q = `
		SELECT id, room_id, created_at, user_id, description, room_rating, hotel_rating, approved
		FROM reviews
		WHERE user_id = $1
		ORDER BY id ASC
	`
	rows, err := r.DB.QueryContext(ctx, q, userID)
	if err != nil {
		return nil, fmt.Errorf("list reviews by user: query: %w", err)
	}
	defer rows.Close()

	var res []models.Review
	for rows.Next() {
		var rv models.Review
		if err := rows.Scan(
			&rv.ID,
			&rv.RoomID,
			&rv.CreatedAt,
			&rv.UserID,
			&rv.Description,
			&rv.RoomRating,
			&rv.HotelRating,
			&rv.Approved,
		); err != nil {
			return nil, fmt.Errorf("list reviews by user: scan: %w", err)
		}
		res = append(res, rv)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("list reviews by user: rows: %w", err)
	}
	return res, nil
}


func (r *ReviewRepo) DeleteByID(ctx context.Context, reviewID int64) error {
	const q = `DELETE FROM reviews WHERE id = $1`
	res, err := r.DB.ExecContext(ctx, q, reviewID)
	if err != nil {
		return fmt.Errorf("delete review: exec: %w", err)
	}
	affected, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("delete review: affected: %w", err)
	}
	if affected == 0 {
		return erors.ErrNotFound
	}
	return nil
}


func (r *ReviewRepo) ListByRoomID(ctx context.Context, roomID int64) ([]models.Review, error) {
	const q = `
		SELECT id, room_id, created_at, user_id, description, room_rating, hotel_rating, approved
		FROM reviews
		WHERE room_id = $1
		ORDER BY id ASC
	`
	rows, err := r.DB.QueryContext(ctx, q, roomID)
	if err != nil {
		return nil, fmt.Errorf("list reviews by room: query: %w", err)
	}
	defer rows.Close()

	var res []models.Review
	for rows.Next() {
		var rv models.Review
		if err := rows.Scan(
			&rv.ID,
			&rv.RoomID,
			&rv.CreatedAt,
			&rv.UserID,
			&rv.Description,
			&rv.RoomRating,
			&rv.HotelRating,
			&rv.Approved,
		); err != nil {
			return nil, fmt.Errorf("list reviews by room: scan: %w", err)
		}
		res = append(res, rv)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("list reviews by room: rows: %w", err)
	}
	return res, nil
}


