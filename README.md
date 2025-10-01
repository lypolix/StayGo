# StayGo - Друзья рекоммендуют

Сервис для отелей и путешествий с аутентификацией, управлением отелями и комнатами, возможностью с легкостью добавить понравившиеся варианты в избранное и полноценной системой отзывов. Каждый пользователь может добавить друзей и получать рекоммендации в зависимости от своих предпочтений и выбора друзей. 

Нами разработана интуитивно понятная система поиска по фильрам, позволяющая подобрать идеальный вариант для отпуска. Каждый пользователь создаёт аккаунт, в котором доступна информация о нём с возможностью изменения. А также реализована админская панель для управления сервисом, удаления некорректных отзывов и полного контроля над системой.

Сервис интегрирован с Telegram и пользователи могут использовать соц-сеть для быстрого входа в аккаунт, что позволит в дальнейшем быстро искать и добавлять друзей!

- Скринкаст: добавьте ссылку на видео-демо
- Прод: добавьте ссылку на развернутый сервис 

---

## 🚀 Быстрый старт

### С использованием Docker 
```
git clone https://github.com/ostrovok-hackathon-2025/staygo.git
cd backend
cp .env.example .env 
docker compose up --build
```

Открыть в браузере:
```
API: http://localhost:8080
Swagger UI: http://localhost:8080/swagger/index.html
```

### Локальный запуск без Docker

```
cd backend
go mod tidy

go run ./cmd/StayGo
```
---

## 📋 Требования

### Ресурсы

```
- CPU: 2 ядра
- RAM: 2–4 GB
- Диск: 1+ GB
```

### Зависимости
- Go 1.21+ (для локального запуска)
- Docker + Docker Compose (для контейнеров)
- PostgreSQL 16 (в compose как db)

### Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```
APP_PORT=8080
DB_URL=postgres://app:app@db:5432/app?sslmode=disable
JWT_SECRET=your-secure-secret
CONFIG_PATH=./configs/config.yaml
```

Описание:
- `APP_PORT` — порт HTTP сервера
- `DB_URL` — строка подключения к PostgreSQL
- `JWT_SECRET` — секрет для подписи JWT токенов
- `CONFIG_PATH` — путь к YAML‑конфигурации (если используется)

---

## 📊 Миграции и данные

SQL‑миграции находятся в директории `migrations` (создание пользователей, отелей, комнат, отзывов, избранного и т.д.).

Запуск миграций в контейнере приложения (пример):

```
docker compose exec app bash -lc "go run ./cmd/tools/migrate.go up"
```

---

## 🔌 API Endpoints

Базовый URL: `http://localhost:8080`

### 📖 Документация
- Swagger UI: `http://localhost:8080/swagger/index.html`
- Swagger JSON (при раздаче статикой): `http://localhost:8080/swagger/doc.json`

### 🔐 Аутентификация
| Метод | Endpoint        | Описание                 |
|------:|------------------|--------------------------|
| POST  | /auth/register   | Регистрация пользователя |
| POST  | /auth/login      | Логин, выдача JWT токенов |

### 👤 Пользователи
| Метод | Endpoint        | Описание                      | Auth |
|------:|-----------------|-------------------------------|:----:|
| GET   | /users/profile  | Профиль текущего пользователя |  ✅  |
| PATCH | /users/profile  | Обновление профиля            |  ✅  |

### 🏨 Отели
| Метод | Endpoint              | Описание              | Auth |
|------:|-----------------------|-----------------------|:----:|
| GET   | /hotels               | Список всех отелей    |  ❌  |
| GET   | /hotels/search        | Поиск отелей по городу|  ❌  |
| GET   | /hotels/{hotelid}     | Отель по ID           |  ❌  |
| POST  | /hotels               | Создание отеля        |  ✅  |

### 🛏️ Комнаты
| Метод | Endpoint                   | Описание                                        | Auth |
|------:|----------------------------|-------------------------------------------------|:----:|
| GET   | /rooms/search              | Поиск комнат по городу, гостям и датам          |  ❌  |
| GET   | /rooms/{roomid}           | Комната по ID                                   |  ❌  |
| GET   | /hotels/{hotelid}/rooms   | Комнаты отеля                                   |  ❌  |
| POST  | /rooms                     | Создание комнаты                                |  ✅  |

### ⭐ Избранное
| Метод | Endpoint              | Описание                 | Auth |
|------:|-----------------------|--------------------------|:----:|
| GET   | /favorites            | Список избранных комнат  |  ✅  |
| POST  | /favorites            | Добавить в избранное     |  ✅  |
| DELETE| /favorites/{roomid}   | Удалить из избранного    |  ✅  |

### 📝 Отзывы
| Метод  | Endpoint                 | Описание                 | Auth |
|-------:|--------------------------|--------------------------|:----:|
| POST   | /reviews                 | Создать отзыв            |  ✅  |
| GET    | /reviews/profile         | Мои отзывы               |  ✅  |
| GET    | /reviews/users/{userid}  | Отзывы пользователя      |  ❌  |
| GET    | /rooms/{roomid}/reviews  | Отзывы о комнате         |  ❌  |
| DELETE | /reviews/{id}            | Удалить отзыв (admin)    |  ✅  |

#### 🧑‍🤝‍🧑 Друзья и рекомендации
Группа маршрутов защищена `Authorization: Bearer <JWT>`.

| Метод | Endpoint            | Описание                                 | Auth |
|------:|---------------------|------------------------------------------|:----:|
| POST  | /users/friends      | Добавить друга по email                  |  ✅  |
| GET   | /users/friends      | Список друзей текущего пользователя      |  ✅  |
| GET   | /users/recommend    | Рекомендации друзей для пользователя     |  ✅  |

### 🔑 Заголовок авторизации
Все защищенные эндпоинты требуют:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🧪 Тестирование API (cURL)

Логин:

```
curl -X POST http://localhost:8080/auth/login
-H "Content-Type: application/json"
-d '{"email":"admin@example.com","password":"admin123"}'
```

Получить профиль (с токеном):

```
TOKEN="your_jwt_token_here"
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/users/me
```

Поиск отелей по городу:
```
curl "http://localhost:8080/hotels/search?city=Moscow"
```

Поиск комнат:
```
curl "http://localhost:8080/rooms/search?city=Moscow&guests=2&checkin=2024-12-01&checkout=2024-12-05"
```

Добавить друга по email

```
curl -X POST http://localhost:8080/users/friends \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"email":"friend@example.com"}'

```

Получить список друзей

```
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/users/friends
```
Получить рекомендации друзей

```
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/users/recommend
```
---

## 🛠️ Полезные команды

Обновить зависимости
```
go mod tidy
```

Сгенерировать/обновить Swagger документацию
```
swag init -g ./cmd/StayGo/main.go -o ./docs
```

Сборка приложения
```
go build ./...
```

Проверить доступность Swagger JSON

```
curl http://localhost:8080/swagger/doc.json 
```

Health check

```
curl http://localhost:8080/health
```

---

## 🏗️ Технический стек
- Backend: Go + Gin
- Аутентификация: JWT
- База данных: PostgreSQL
- Документация: Swagger UI
- Контейнеризация: Docker + Docker Compose

---

## 📁 Структура проекта

```
backend/
├── cmd/
│ └── StayGo/
│ └── main.go # Точка входа приложения
├── docs/ # Сгенерированная Swagger документация
├── migrations/ # SQL миграции базы данных
├── internal/ # Внутренние пакеты приложения
├── configs/ # Конфигурационные файлы
└── go.mod # Зависимости Go
```

---

## 🔄 Модули системы
- ✅ Аутентификация — регистрация, логин, JWT
- ✅ Пользователи — профили, управление данными
- ✅ Отели — создание, поиск, управление
- ✅ Комнаты — создание, поиск, бронирование
- ✅ Отзывы — создание, модерация, просмотр
- ✅ Избранное — добавление/удаление комнат
- ✅ Друзья и рекомендации — социальные функции (поиск и добавление друзей, а также просмотр их списка)
- ✅ Рекоммендации — получение рекомендаций в зависимомти от лайков друзей
---

> StayGo Backend — мощное решение для управления отелями и путешествиями 🚀
