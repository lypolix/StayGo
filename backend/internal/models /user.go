package models

type User struct {
    ID            int64     `db:"id" json:"id"`
    Name          string    `db:"name" json:"name"`
    Email         string    `db:"email" json:"email"`
    Password      string    `db:"password" json:"password"`
    DateOfBirth   string    `db:"date_of_birth" json:"date_of_birth"`
    CreatedAt     string    `db:"created_at" json:"created_at"`
    City          string    `db:"city" json:"city"`
    Role          string    `db:"role" json:"role"`
    ReviewIDs     []int64   `db:"review_ids" json:"review_ids"`      // Список id отзывов
    IDNetworks    []int64   `db:"id_networks" json:"id_networks"`    // Связь с сетями
    VisitedRoomID []int64   `db:"visited_room_id" json:"visited_room_id"` // Список посещённых комнат
    FavRoomsID    []int64   `db:"fav_rooms_id" json:"fav_rooms_id"`  // Список понравившихся комнат
    FriendsID     []int64   `db:"friends_id" json:"friends_id"`      // Список друзей
    Refresh       string    `db:"refresh" json:"refresh"`
}
