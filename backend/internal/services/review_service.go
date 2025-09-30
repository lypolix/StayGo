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

func (s *ReviewService) ListReviews(ctx context.Context, roomID int64) ([]models.Review, error) {
    return s.repo.List(roomID)
}

func (s *ReviewService) DeleteByID(ctx context.Context, reviewID int64) error {
	if reviewID <= 0 {
		return erors.ErrInvalidInput
	}
	// Пробрасываем доменные ошибки репозитория без лишних оберток
	return s.repo.DeleteByID(ctx, reviewID)
}
