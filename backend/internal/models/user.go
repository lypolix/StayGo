package models

import "database/sql"

// User структура пользователя
// @Description Данные пользователя системы, включая профили, связи и служебные поля
type User struct {
    // Уникальный идентификатор пользователя
    ID int64 `db:"id" json:"id" example:"7"`

    // Имя пользователя
    Name string `db:"name" json:"name" example:"Alice"`

    // Email пользователя
    Email string `db:"email" json:"email" example:"alice@example.com"`

    // Хэш пароля (не возвращать во внешних ответах)
    Password string `db:"password" json:"password,omitempty" example:"$2a$10$..."`

    // Дата рождения в формате YYYY-MM-DD
    DateOfBirth string `db:"date_of_birth" json:"date_of_birth" example:"1998-07-15"`

    // Дата создания учетной записи (ISO8601)
    CreatedAt string `db:"created_at" json:"created_at" example:"2025-09-01T10:20:30Z"`

    // Город проживания
    City string `db:"city" json:"city" example:"Moscow"`

    // Роль пользователя (user/admin)
    Role string `db:"role" json:"role" example:"user"`

    // Список ID отзывов пользователя
    ReviewIDs []int64 `db:"review_ids" json:"review_ids" example:"[1001,1002]"`

    // Список ID записей соцсетей пользователя
    IDNetworks []int64 `db:"id_networks" json:"id_networks" example:"[11,12]"`

    // Список ID посещенных комнат
    VisitedRoomID []int64 `db:"visited_room_id" json:"visited_room_id" example:"[2001,2003]"`

    // Список ID избранных комнат
    FavRoomsID []int64 `db:"fav_rooms_id" json:"fav_rooms_id" example:"[2002,2005]"`

    // Refresh-токен (nullable, не возвращать во внешних ответах)
    Refresh sql.NullString `db:"refresh" json:"refresh,omitempty" swaggertype:"string" example:"eyJhbGciOi..."` // swaggertype для корректного показа
}

// UserInfoDTO DTO информации пользователя для ответов
// @Description Публичная информация пользователя без чувствительных полей
type UserInfoDTO struct {
    // Имя пользователя
    Name string `json:"name" example:"Alice"`

    // Email пользователя
    Email string `json:"email" example:"alice@example.com"`

    // Дата рождения (может отсутствовать)
    DateOfBirth string `json:"date_of_birth,omitempty" example:"1998-07-15"`

    // Город проживания (может отсутствовать)
    City string `json:"city,omitempty" example:"Moscow"`

    // Дата создания аккаунта
    CreatedAt string `json:"created_at" example:"2025-09-01T10:20:30Z"`
}

// UserUpdateDTO DTO для обновления данных пользователя
// @Description Поля, которые можно изменить в профиле
type UserUpdateDTO struct {
    // Внутренний ID (берется из контекста, в теле не передается)
    ID int64 `json:"-"`

    // Новое имя пользователя
    Name string `json:"name" example:"Alice"`

    // Новый email пользователя
    Email string `json:"email" example:"alice.new@example.com"`

    // Новый город (опционально)
    City string `json:"city,omitempty" example:"Saint Petersburg"`
}
