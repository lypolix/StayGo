package logger

import (
	"go.uber.org/zap"
)

type Logger interface {
	Info(msg string, fields ...zap.Field)
	Error(msg string, fields ...zap.Field)
	Warn(msg string, fields ...zap.Field)
}

type LoggerStruct struct {
	logger *zap.Logger
}

func NewLogger() Logger {
	logger, _ := zap.NewProduction(zap.AddStacktrace(zap.DPanicLevel))
	return &LoggerStruct{logger: logger}
}

func (l *LoggerStruct) Info(msg string, fields ...zap.Field) {
	l.logger.Info(msg, fields...)
}

func (l *LoggerStruct) Error(msg string, fields ...zap.Field) {
	l.logger.Error(msg, fields...)
}

func (l *LoggerStruct) Warn(msg string, fields ...zap.Field) {
	l.logger.Warn(msg, fields...)
}
