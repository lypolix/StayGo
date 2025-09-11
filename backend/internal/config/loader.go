package config

import (
    "fmt"
    "os"
    "strings"

    "github.com/spf13/viper"
)

func LoadConfig() (*Config, error) {
    // Определяем окружение
    env := getEnv("APP_ENV", "development")
    
    // Настраиваем viper
    viper.SetConfigName("config")
    viper.SetConfigType("yaml")
    viper.AddConfigPath("./configs")
    viper.AddConfigPath("../configs")
    viper.AddConfigPath("../../configs")

    // Загружаем базовый конфиг
    if err := viper.ReadInConfig(); err != nil {
        return nil, fmt.Errorf("failed to read base config: %w", err)
    }

    // Объединяем с конфигом окружения
    viper.SetConfigName(fmt.Sprintf("config.%s", env))
    if err := viper.MergeInConfig(); err != nil {
        return nil, fmt.Errorf("failed to merge %s config: %w", env, err)
    }

    // Включаем поддержку переменных окружения
    viper.AutomaticEnv()
    viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

    // Разбираем конфиг в структуру
    var cfg Config
    if err := viper.Unmarshal(&cfg); err != nil {
        return nil, fmt.Errorf("failed to unmarshal config: %w", err)
    }

    return &cfg, nil
}

func getEnv(key, defaultValue string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return defaultValue
}
