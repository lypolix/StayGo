package services

import (
    "context"
    "backend/internal/models"
    "backend/internal/repos"
)

type FavoriteRoomService interface {
    AddToFavorites(ctx context.Context, userID, roomID int64) error
    RemoveFromFavorites(ctx context.Context, userID, roomID int64) error
    GetFavorites(ctx context.Context, userID int64) ([]models.Room, error)
}

type favoriteRoomService struct {
    repo repos.FavoriteRoomRepo
}

func NewFavoriteRoomService(repo repos.FavoriteRoomRepo) FavoriteRoomService {
    return &favoriteRoomService{repo: repo}
}

func (s *favoriteRoomService) AddToFavorites(ctx context.Context, userID, roomID int64) error {
    return s.repo.AddRoomToFavorites(ctx, userID, roomID)
}

func (s *favoriteRoomService) RemoveFromFavorites(ctx context.Context, userID, roomID int64) error {
    return s.repo.RemoveRoomFromFavorites(ctx, userID, roomID)
}

func (s *favoriteRoomService) GetFavorites(ctx context.Context, userID int64) ([]models.Room, error) {
    return s.repo.GetFavoriteRooms(ctx, userID)
}
