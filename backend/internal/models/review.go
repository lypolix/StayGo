package models

// Review модель отзыва
// @Description Отзыв пользователя о комнате/отеле с оценками и статусом модерации
type Review struct {
    // Уникальный идентификатор отзыва
    ID int64 `db:"id" json:"id" example:"1001"`

    // Идентификатор комнаты, к которой относится отзыв
    RoomID int64 `db:"room_id" json:"room_id" example:"42"`

    // Дата и время создания в ISO8601
    CreatedAt string `db:"created_at" json:"created_at" example:"2025-10-01T18:30:00Z"`

    // Идентификатор пользователя, оставившего отзыв
    UserID int64 `db:"user_id" json:"user_id" example:"7"`

    // Текст отзыва
    Description string `db:"description" json:"description" example:"Тихо, чисто, понравилось расположение"`

    // Оценка комнаты (1-5)
    RoomRating int `db:"room_rating" json:"room_rating" example:"5"`

    // Оценка отеля (1-5)
    HotelRating int `db:"hotel_rating" json:"hotel_rating" example:"4"`

    // Статус модерации
    Approved bool `db:"approved" json:"approved" example:"true"`
}

// CreateReviewDTO входные данные для создания отзыва
// @Description Данные, необходимые для создания нового отзыва; user_id можно брать из JWT контекста
type CreateReviewDTO struct {
    // Идентификатор комнаты
    // required: true
    RoomID int64 `json:"room_id" binding:"required" example:"42"`

    // Идентификатор пользователя (может быть подставлен из контекста авторизации)
    // required: false
    UserID int64 `json:"user_id" example:"7"`

    // Оценка комнаты (1-5)
    // required: true
    RoomRating int `json:"rating" binding:"required,min=1,max=5" example:"5"`

    // Текст отзыва
    // required: false
    Description string `json:"description" example:"Отличная звукоизоляция и вежливый персонал"`
}
