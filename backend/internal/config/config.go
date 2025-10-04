package config


type Config struct {
    Server   ServerConfig   `mapstructure:"server"`
    Database DatabaseConfig `mapstructure:"database"`
    JWT      JWTConfig      `mapstructure:"jwt"`
    App      AppConfig      `mapstructure:"app"`
}

type ServerConfig struct {
    Host         string `mapstructure:"host"`
    Port         string `mapstructure:"port"`
    ReadTimeout  int    `mapstructure:"read_timeout"`
    WriteTimeout int    `mapstructure:"write_timeout"`
}

type DatabaseConfig struct {
    Host     string `mapstructure:"host"`
    Port     string `mapstructure:"port"`
    User     string `mapstructure:"user"`
    Password string `mapstructure:"password"`
    Name     string `mapstructure:"name"`
    SSLMode  string `mapstructure:"ssl_mode"`
}

type JWTConfig struct {
    Secret         string `mapstructure:"secret"`
    AccessTokenTTL int    `mapstructure:"access_token_ttl"`
    RefreshTokenTTL int   `mapstructure:"refresh_token_ttl"`
}

type AppConfig struct {
    Environment string `mapstructure:"environment"`
    LogLevel    string `mapstructure:"log_level"`
    Debug       bool   `mapstructure:"debug"`
    Name        string `mapstructure:"name"`
    Version     string `mapstructure:"version"`
}
