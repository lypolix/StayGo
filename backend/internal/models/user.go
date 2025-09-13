package models

type User struct {
	ID            int64   `db:"id" json:"id"`
	Name          string  `db:"name" json:"name"`
	Email         string  `db:"email" json:"email"`
	Password      string  `db:"password" json:"password"`
	DateOfBirth   string  `db:"date_of_birth" json:"date_of_birth"`
	CreatedAt     string  `db:"created_at" json:"created_at"`
	City          string  `db:"city" json:"city"`
	Role          string  `db:"role" json:"role"`
	ReviewIDs     []int64 `db:"review_ids" json:"review_ids"`
	IDNetworks    []int64 `db:"id_networks" json:"id_networks"`
	VisitedRoomID []int64 `db:"visited_room_id" json:"visited_room_id"`
	FavRoomsID    []int64 `db:"fav_rooms_id" json:"fav_rooms_id"`
	FriendsID     []int64 `db:"friends_id" json:"friends_id"`
	Refresh       string  `db:"refresh" json:"refresh"`
}

// UserInfoDTO получение информации пользователя (надо перенести в handlers)
type UserInfoDTO struct {
	Name        string `json:"name"`
	Email       string `json:"email"`
	DateOfBirth string `json:"date_of_birth,omitempty"`
	City        string `json:"city,omitempty"`
	CreatedAt   string `json:"created_at"`
}

// UserUpdateDTO параметры для изменения информации по пользователю (надо перенести в handlers)
type UserUpdateDTO struct {
	ID    int64  `json:"-"`
	Name  string `json:"name"`
	Email string `json:"email"`
	City  string `json:"city,omitempty"`
}
