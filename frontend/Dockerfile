# Пример для образа Go backend

FROM golang:1.20-alpine as builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Сборка приложения
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/StayGo

FROM alpine:latest

WORKDIR /app

# Копируем собранный бинарник
COPY --from=builder /app/main .

# Копируем папку с конфигами
COPY --from=builder /app/configs ./configs

EXPOSE 8080

CMD ["./main"]
