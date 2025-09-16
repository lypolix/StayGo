package models

type Review struct {
    ID          int64    `db:"id" json:"id"`
    RoomID      int64    `db:"room_id" json:"room_id"`
    CreatedAt   string   `db:"created_at" json:"created_at"`
    UserID      int64    `db:"user_id" json:"user_id"`
    Description string   `db:"description" json:"description"`
    RoomRating  int      `db:"room_rating" json:"room_rating"`
    HotelRating int      `db:"hotel_rating" json:"hotel_rating"`
    Approved    bool     `db:"approved" json:"approved"`
}


type CreateReviewDTO struct {
    RoomID  int64  `json:"room_id" binding:"required"`
    UserID  int64  `json:"user_id"` // можно взять из контекста аутентификации
    RoomRating  int    `json:"rating" binding:"required,min=1,max=5"`
    Description string `json:"description"`
}