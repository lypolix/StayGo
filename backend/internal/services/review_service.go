package services

import (
	"backend/internal/erors"
	"backend/internal/models"
	"backend/internal/repos"
	"context"
)

type ReviewService struct {
    repo *repos.ReviewRepo
}

func NewReviewService(repo *repos.ReviewRepo) *ReviewService {
    return &ReviewService{repo: repo}
}

func (s *ReviewService) AddReview(ctx context.Context, review models.Review) error {
    return s.repo.Create(&review)
}

func (s *ReviewService) ListMyReviews(ctx context.Context, userID int64) ([]models.Review, error) {
	// userID валиден, т.к. берётся из middleware; доп. проверка опциональна
	return s.repo.ListByUserID(ctx, userID)
}

func (s *ReviewService) DeleteByID(ctx context.Context, reviewID int64) error {
	if reviewID <= 0 {
		return erors.ErrInvalidInput
	}
	// Пробрасываем доменные ошибки репозитория без лишних оберток
	return s.repo.DeleteByID(ctx, reviewID)
}

func (s *ReviewService) ListByRoomID(ctx context.Context, roomID int64) ([]models.Review, error) {
    if roomID <= 0 {
        return nil, erors.ErrInvalidInput
    }
    return s.repo.ListByRoomID(ctx, roomID)
}