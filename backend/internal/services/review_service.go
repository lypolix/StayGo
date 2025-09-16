package services

import (
    "context"
    "backend/internal/models"
    "backend/internal/repos"
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
