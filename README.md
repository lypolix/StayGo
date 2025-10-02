# StayGo - Друзья рекоммендуют

Сервис для отелей и путешествий с аутентификацией, управлением отелями и комнатами, возможностью с легкостью добавить понравившиеся варианты в избранное и полноценной системой отзывов. Каждый пользователь может добавить друзей и получать рекоммендации в зависимости от своих предпочтений и выбора друзей. 

Нами разработана интуитивно понятная система поиска по фильрам, позволяющая подобрать идеальный вариант для отпуска. Каждый пользователь создаёт аккаунт, в котором доступна информация о нём с возможностью изменения. А также реализована админская панель для управления сервисом, удаления некорректных отзывов и полного контроля над системой.

Сервис интегрирован с Telegram и пользователи могут использовать соц-сеть для быстрого входа в аккаунт, что позволит в дальнейшем быстро искать и добавлять друзей!

- Скринкаст: добаить ссылку на видео-демо

---

## 🚀 Быстрый старт

### С использованием Docker 
```
git clone https://github.com/ostrovok-hackathon-2025/staygo.git
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
DB_URL=postgres://postgres:1234@localhost:5433/traveldb?sslmode=disable
JWT_SECRET=your-secure-secret
CONFIG_PATH=./configs/config.yaml
```

Описание:
- `APP_PORT` — порт HTTP сервера
- `DB_URL` — строка подключения к PostgreSQL
- `JWT_SECRET` — секрет для подписи JWT токенов
- `CONFIG_PATH` — путь к YAML‑конфигурации (если используется)

---

## Сидирование 

Для создания таблиц и данных 

```
docker-compose exec db psql -U postgres -d traveldb -f /tmp/seed.sql
```

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

## 🔌 API Endpoints

### 🔍 Health
| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| GET | `/health` | Проверка состояния сервиса | ❌ |

### 🔐 Аутентификация
| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | `/auth/register` | Регистрация пользователя | ❌ |
| POST | `/auth/login` | Логин, выдача JWT | ❌ |
| POST | `/auth/telegram` | Telegram Login, выдача JWT | ❌ |
| GET | `/auth/telegram/bot-info` | Информация о telegram аккаунте | ❌ |

### 👤 Пользователи
*Группа защищена Authorization: Bearer <JWT>*

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| GET | `/users/profile` | Профиль текущего пользователя | ✅ |
| PUT | `/users/profile` | Обновление профиля | ✅ |
| POST | `/users/friends` | Добавить друга по email | ✅ |
| GET | `/users/friends` | Список друзей | ✅ |
| GET | `/users/recommend` | Рекомендации друзей | ✅ |

### 🏨 Отели
*Публичные GET; создание — только для админ‑группы*

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| GET | `/hotels` | Список всех отелей | ❌ |
| GET | `/hotels/search` | Поиск отелей по городу | ❌ |
| GET | `/hotels/:hotelid` | Отель по ID | ❌ |
| GET | `/hotels/:hotelid/rooms` | Комнаты отеля | ❌ |

### 🛏️ Комнаты
*Публичные GET; создание — только для админ‑группы*

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| GET | `/rooms/:roomid` | Комната по ID | ❌ |
| GET | `/rooms/search` | Поиск комнат по городу, гостям и датам | ❌ |
| GET | `/rooms/:roomid/reviews` | Отзывы по комнате | ❌ |

### ⭐ Избранное
*Группа защищена Authorization: Bearer <JWT>*

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | `/favorites` | Добавить комнату в избранное | ✅ |
| DELETE | `/favorites/:roomid` | Удалить комнату из избранного | ✅ |
| GET | `/favorites` | Список избранных комнат | ✅ |

### 📝 Отзывы
*Создание и пользовательские выборки — по JWT*

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | `/reviews` | Создать отзыв | ✅ |
| GET | `/reviews` | Список отзывов текущего пользователя | ✅ |
| GET | `/reviews/users/:userid` | Отзывы указанного пользователя | ✅ |

### 🛡️ Админ
*Группа защищена Authorization: Bearer <JWT> и требует роль администратора*

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | `/admin/hotels` | Создать отель | ✅ |
| POST | `/admin/rooms` | Создать комнату | ✅ |
| DELETE | `/admin/reviews/:id` | Удалить отзыв по ID | ✅ |

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

### 🔙 Backend
- **Язык**: Go 1.21+
- **Фреймворк**: Gin
- **Аутентификация**: JWT
- **База данных**: PostgreSQL 16
- **Документация**: Swagger UI
- **Контейнеризация**: Docker + Docker Compose
- **Миграции**: SQL миграции

### 🎨 Frontend
- **Фреймворк**: React 18 + TypeScript
- **Сборщик**: Vite
- **UI библиотека**: Chakra UI
- **State Management**: Redux Toolkit + RTK Query
- **Маршрутизация**: React Router
- **Дата пикер**: React DatePicker
- **Утилиты**: Custom hooks
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

```
frontend/
├── public/                 # Статические файлы
├── src/
│   ├── app/               # Store, API, routing
│   ├── assets/            # Изображения, иконки
│   ├── components/        # Переиспользуемые компоненты
│   ├── features/          # Feature-based компоненты
│   ├── hooks/             # Custom React hooks
│   ├── shared/            # Общие утилиты и компоненты
│   ├── styles/            # Глобальные стили и темы
│   ├── utils/             # Вспомогательные функции
│   ├── App.tsx            # Корневой компонент
│   ├── main.tsx           # Точка входа приложения
│   └── vite-env.d.ts      # Типы Vite
├── .env                   # Переменные окружения
├── .env.example           # Пример переменных окружения
├── .eslintrc.cjs          # Конфигурация ESLint
├── .prettierrc            # Конфигурация Prettier
└── package.json           # Зависимости проекта
```

---

## 🔄 Модули системы
- ✅ Аутентификация — регистрация, логин, JWT
- ✅ Пользователи — профили, управление данными
- ✅ Отели — создание, поиск, управление
- ✅ Комнаты — создание, поиск, бронирование
- ✅ Отзывы — создание, модерация, просмотр
- ✅ Избранное — добавление/удаление комнат
- ✅ Ситема поиска по фильтрам — можно искать по предпочтительным характеристикам
- ✅ Друзья — социальные функции (поиск и добавление друзей, а также просмотр их списка)
- ✅ Рекоммендации — получение рекомендаций в зависимомти от лайков друзей
- ✅ Интеграция с Telegram — возможность входа через telegram аккаунт с дальнейшим поиском друзей

---

> StayGo Backend — мощное решение для управления отелями и путешествиями 🚀
