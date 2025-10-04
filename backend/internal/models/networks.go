package models

// Network социальные сети пользователя
// @Description Ссылки/идентификаторы пользователя в соцсетях
type Network struct {
    // Идентификатор пользователя (владельца профилей)
    IDUser int64 `db:"id_user" json:"id_user" example:"123"`

    // Ник/ссылка в Telegram (указывайте username без @ или полную ссылку)
    Telegram string `db:"telegram" json:"telegram" example:"t.me/alice_dev"`

    // Ник/ссылка во VK
    VK string `db:"vk" json:"vk" example:"vk.com/alice_dev"`
}
