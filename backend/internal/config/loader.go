package config

import (
    "fmt"
    "os"
    "strings"

    "github.com/spf13/viper"
)

func LoadConfig() (*Config, error) {
    env := getEnv("APP_ENV", "development")

    viper.SetConfigName("config")
    viper.SetConfigType("yaml")
    viper.AddConfigPath("./configs")
    viper.AddConfigPath("../configs")
    viper.AddConfigPath("../../configs")

    if err := viper.ReadInConfig(); err != nil {
        return nil, fmt.Errorf("failed to read base config: %w", err)
    }
    viper.SetConfigName(fmt.Sprintf("config.%s", env))
    if err := viper.MergeInConfig(); err != nil {
        return nil, fmt.Errorf("failed to merge %s config: %w", env, err)
    }

    viper.AutomaticEnv()
    viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

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
