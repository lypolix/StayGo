package models

type Room struct {
    ID          int64    `db:"id" json:"id"`
    Beds        int      `db:"beds" json:"beds"`
    Price       int      `db:"price" json:"price"`
    Rating      int      `db:"rating" json:"rating"`
    Description string   `db:"description" json:"description"`
    HotelID     int64    `db:"hotel_id" json:"hotel_id"`
}

type CreateRoomDTO struct {
    HotelID     int64   `json:"hotel_id" binding:"required"`
    Beds        int     `json:"beds" binding:"required"`
    Price       float64 `json:"price" binding:"required"`
    Description string  `json:"description"`
}