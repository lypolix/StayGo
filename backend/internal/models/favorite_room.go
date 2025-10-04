package models

// FavoriteRoomDTO входные данные для добавления комнаты в избранное
// @Description Идентификатор комнаты, которую нужно добавить в избранное
type FavoriteRoomDTO struct {
	RoomID int64 `json:"roomid" binding:"required,min=1"`
}
