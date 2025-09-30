package services

import (
	"backend/internal/erors"
	"backend/internal/models"
	"backend/internal/repos"
	"context"
	"strings"
)

type RoomServiceInterface interface {
	CreateRoom(ctx context.Context, room *models.Room) error
	GetRoomsByHotelID(ctx context.Context, hotelID int64) ([]models.Room, error)
	GetByID(ctx context.Context, roomID int64) (models.Room, error)
	SearchRooms(ctx context.Context, city string, guests int, checkin, checkout string) ([]models.Room, error)
}

type roomService struct {
	roomRepo repos.RoomRepoInterface
}

func NewRoomService(roomRepo repos.RoomRepoInterface) RoomServiceInterface {
	return roomService{roomRepo: roomRepo}
}

func (s roomService) CreateRoom(ctx context.Context, room *models.Room) error {
	return s.roomRepo.Create(ctx, room)
}

func (s roomService) GetRoomsByHotelID(ctx context.Context, hotelID int64) ([]models.Room, error) {
	return s.roomRepo.GetRoomsByHotelID(ctx, hotelID)
}

func (s roomService) GetByID(ctx context.Context, roomID int64) (models.Room, error) {
	return s.roomRepo.GetRoomByID(ctx, roomID)
}

func (s roomService) SearchRooms(ctx context.Context, city string, guests int, checkin, checkout string) ([]models.Room, error) {
	if strings.TrimSpace(city) == "" || guests <= 0 {
		return nil, erors.ErrInvalidInput
	}
	return s.roomRepo.SearchRooms(ctx, city, guests, checkin, checkout)
}
