package models

// Room модель комнаты/номера
// @Description Информация о комнате, включая вместимость, цену, рейтинг и привязку к отелю
type Room struct {
    // Уникальный идентификатор комнаты
    ID int64 `db:"id" json:"id" example:"2001"`

    // Количество спальных мест
    Beds int `db:"beds" json:"beds" example:"2"`

    // Цена за ночь (в целых единицах, например, рублях)
    Price int `db:"price" json:"price" example:"4500"`

    // Текущий рейтинг комнаты (1-5)
    Rating int `db:"rating" json:"rating" example:"4"`

    // Описание комнаты
    Description string `db:"description" json:"description" example:"Уютный номер с видом на город"`

    // Идентификатор отеля, к которому относится комната
    HotelID int64 `db:"hotel_id" json:"hotel_id" example:"101"`
}

// CreateRoomDTO входные данные для создания комнаты
// @Description Данные, необходимые для создания новой комнаты
type CreateRoomDTO struct {
    // Идентификатор отеля
    // required: true
    HotelID int64 `json:"hotel_id" binding:"required" example:"101"`

    // Количество спальных мест
    // required: true
    Beds int `json:"beds" binding:"required" example:"2"`

    // Цена за ночь (дробное значение поддерживается)
    // required: true
    Price float64 `json:"price" binding:"required" example:"4599.99"`

    // Описание комнаты
    // required: false
    Description string `json:"description" example:"Тихий номер с большой кроватью и рабочим столом"`
}
