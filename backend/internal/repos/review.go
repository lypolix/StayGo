package repos

import (
    "database/sql"
    "backend/internal/models"
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


func (r *ReviewRepo) List(roomID int64) ([]models.Review, error) {
    rows, err := r.DB.Query(`SELECT id, room_id, created_at, user_id, description, room_rating, hotel_rating, approved FROM reviews WHERE room_id = $1`, roomID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var reviews []models.Review
    for rows.Next() {
        var review models.Review
        if err := rows.Scan(&review.ID, &review.RoomID, &review.CreatedAt, &review.UserID, &review.Description, &review.RoomRating, &review.HotelRating, &review.Approved); err != nil {
            return nil, err
        }
        reviews = append(reviews, review)
    }
    return reviews, nil
}
