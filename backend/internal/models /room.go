package models

type Room struct {
    ID          int64    `db:"id" json:"id"`
    Beds        int      `db:"beds" json:"beds"`
    Price       int      `db:"price" json:"price"`
    Rating      int      `db:"rating" json:"rating"`
    Description string   `db:"description" json:"description"`
    HotelID     int64    `db:"hotel_id" json:"hotel_id"`
}
