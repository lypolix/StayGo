package models

// Hotel модель отеля
// @Description Основная информация об отеле, включая рейтинг и список комнат
type Hotel struct {
    // Уникальный идентификатор отеля
    ID int64 `db:"id" json:"id" example:"101"`

    // Название отеля
    Name string `db:"name" json:"name" example:"Grand Plaza"`

    // Город расположения
    City string `db:"city" json:"city" example:"Moscow"`

    // Краткое описание отеля
    Description string `db:"description" json:"description" example:"Modern hotel in city center"`

    // Количество звёзд отеля (1-5)
    Stars int `db:"stars" json:"stars" example:"4"`

    // Базовая комната/главный номер (если используется как связка)
    RoomID int64 `db:"room_id" json:"room_id" example:"2001"`

    // Почтовый адрес отеля
    Address string `db:"address" json:"address" example:"Tverskaya St, 7"`

    // Список идентификаторов комнат, относящихся к отелю
    Rooms []int64 `db:"rooms" json:"rooms" example:"[2001,2002,2003]"`
}
