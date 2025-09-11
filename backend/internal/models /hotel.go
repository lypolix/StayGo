package models

type Hotel struct {
    ID          int64    `db:"id" json:"id"`
    Name        string   `db:"name" json:"name"`
    City        string   `db:"city" json:"city"`
    Description string   `db:"description" json:"description"`
    Stars       int      `db:"stars" json:"stars"`
    RoomID      int64    `db:"room_id" json:"room_id"`
    Address     string   `db:"address" json:"address"`
    Rooms       []int64  `db:"rooms" json:"rooms"`        // Список id комнат, связанных с этим отелем
}

