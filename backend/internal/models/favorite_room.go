package models

type FavoriteRoomDTO struct {
	RoomID int64 `json:"roomid" binding:"required,min=1"`
}
