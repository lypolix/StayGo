package services

import (
    "backend/internal/models"
    "backend/internal/repos"
    "context"
)

// RoomServiceInterface описывает методы сервиса комнат
type RoomServiceInterface interface {
    CreateRoom(ctx context.Context, room *models.Room) error
    GetRoomsByHotelID(ctx context.Context, hotelID int64) ([]models.Room, error)
    ListByHotel(ctx context.Context, hotelID int64) ([]models.Room, error)
    GetByID(ctx context.Context, roomID int64) (*models.Room, error)
}

type roomService struct {
    roomRepo repos.RoomRepoInterface
}

// NewRoomService создает новый сервис комнат
func NewRoomService(repo repos.RoomRepoInterface) RoomServiceInterface {
    return &roomService{
        roomRepo: repo,
    }
}

// CreateRoom создает новую комнату
func (s *roomService) CreateRoom(ctx context.Context, room *models.Room) error {
    return s.roomRepo.Create(room)
}

// GetRoomsByHotelID возвращает список комнат по ID отеля
func (s *roomService) GetRoomsByHotelID(ctx context.Context, hotelID int64) ([]models.Room, error) {
    return s.roomRepo.GetByHotelID(ctx, hotelID)
}

func (s *roomService) ListByHotel(ctx context.Context, hotelID int64) ([]models.Room, error) {
    return s.roomRepo.GetRoomsByHotelID(ctx, hotelID)
}

func (s *roomService) GetByID(ctx context.Context, roomID int64) (*models.Room, error) {
    return s.roomRepo.GetRoomByID(ctx, roomID)
}
