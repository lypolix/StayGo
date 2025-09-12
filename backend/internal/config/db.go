package config

import (
    "database/sql"
    _ "github.com/lib/pq"
)

func InitDB(cfg DatabaseConfig) (*sql.DB, error) {
    dsn := "host=" + cfg.Host +
           " port=" + cfg.Port +
           " user=" + cfg.User +
           " password=" + cfg.Password +
           " dbname=" + cfg.Name +
           " sslmode=" + cfg.SSLMode
    db, err := sql.Open("postgres", dsn)
    if err != nil {
        return nil, err
    }
    if err := db.Ping(); err != nil {
        return nil, err
    }
    return db, nil
}
