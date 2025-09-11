package models

type Network struct {
    IDUser   int64    `db:"id_user" json:"id_user"`
    Telegram string   `db:"telegram" json:"telegram"`
    VK       string   `db:"vk" json:"vk"`
}