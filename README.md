# 🪙 Crypto Tracker API

Backend-сервис для отслеживания и агрегации курсов криптовалют с использованием Binance API и публичных блокчейн-API.

REST API для управления монетами, отслеживаемыми адресами и получения исторических данных о ценах с автоматической фоновой синхронизацией.

##  Содержание

- [Возможности](#-возможности)
- [Технологический стек](#-технологический-стек)
- [Требования](#-требования)
- [Установка и запуск](#-установка-и-запуск)
- [Docker](#-docker)
- [API Endpoints](#-api-endpoints)
- [Архитектура](#-архитектура)
- [Тестирование](#-тестирование)
- [Переменные окружения](#-переменные-окружения)

## Возможности

### Основной функционал
-  **Аутентификация** через Bearer token (JWT)
-  **CRUD криптовалют** — управление списком отслеживаемых монет
-  **CRUD адресов** — управление списком отслеживаемых кошельков
-  **Актуальные курсы** — получение данных из Binance API
-  **История цен** — получение исторических данных с фильтрацией по дате
-  **Высота блокчейна** — получение текущей высоты Bitcoin blockchain
-  **Баланс адреса** — получение баланса Bitcoin-адреса
-  **Фоновая синхронизация** — автоматическое обновление курсов
-  **OpenAPI/Swagger** — интерактивная документация API

### Качество кода
-  Retry-логика для внешних API (3 попытки с экспоненциальной задержкой)
-  Централизованная валидация входных данных
-  Кастомные классы ошибок (`AppError`, `DuplicateError`, `ValidationError`, `TaskNotFoundError`)
-  Graceful shutdown — корректная остановка по SIGINT/SIGTERM
-  Таймауты для всех внешних HTTP-запросов
-  Полное покрытие тестами (42 теста)

##  Технологический стек

| Технология | Версия | Назначение |
|------------|--------|------------|
| **Node.js** | 20+ | Runtime |
| **Express.js** | 5.x | Web-фреймворк |
| **TypeScript** | 6.x | Язык программирования |
| **SQLite** | — | База данных (через `better-sqlite3`, без ORM) |
| **Jest** | 30.x | Test runner |
| **Supertest** | 7.x | HTTP-тестирование |
| **Swagger** | 6.x | OpenAPI 3.0 документация |
| **axios** | 1.x | HTTP-клиент для внешних API |
| **jsonwebtoken** | 9.x | JWT-аутентификация |
| **Docker** | — | Контейнеризация |

## Требования

- Node.js 20+
- npm 10+
- Docker и docker-compose (опционально)

## Установка и запуск

### Локальный запуск

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/phohlova/nodejs-practice.git
cd nodejs-practice

# 2. Установите зависимости
npm install

# 3. Создайте .env файл (см. раздел "Переменные окружения")
cp .env.example .env

# 4. Запустите в режиме разработки
npm run dev

# 5. Сервер доступен на http://localhost:3000
```

### Полезные команды

```bash
npm run dev          # Запуск в режиме разработки (ts-node)
npm run build        # Компиляция TypeScript → JavaScript
npm start            # Запуск скомпилированной версии
npm test             # Запуск тестов
npm run db:init      # Инициализация базы данных
npm run db:reset     # Сброс базы данных
```

##  Docker

### Запуск через docker-compose

```bash
# Сборка и запуск
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down

# Пересборка без кэша
docker-compose build --no-cache
```

Контейнер будет доступен на `http://localhost:3000`.

База данных сохраняется в папке `./data/` через volume.

### Полезные Docker-команды

```bash
docker-compose ps                    # Статус контейнеров
docker-compose exec app sh           # Войти в контейнер
docker-compose down --rmi all        # Удалить всё
```

##  API Endpoints

### Базовые эндпоинты

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/status` | Проверка работоспособности |
| `GET` | `/api-docs` | Swagger-документация |
| `GET` | `/secure/data` | Защищённый эндпоинт (требует JWT) |

###  Криптовалюты `/currencies`

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/currencies` | Список всех валют |
| `GET` | `/currencies/:id` | Получить валюту по ID |
| `POST` | `/currencies` | Создать новую валюту |
| `PUT` | `/currencies/:id` | Обновить валюту |
| `DELETE` | `/currencies/:id` | Удалить валюту |

**Пример создания валюты:**
```bash
curl -X POST http://localhost:3000/currencies \
  -H "Content-Type: application/json" \
  -d '{"name":"Bitcoin","ticker":"BTC"}'
```

###  Адреса `/addresses`

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/addresses` | Список всех адресов |
| `GET` | `/addresses/:id` | Получить адрес по ID |
| `POST` | `/addresses` | Добавить новый адрес |
| `PUT` | `/addresses/:id` | Обновить адрес |
| `DELETE` | `/addresses/:id` | Удалить адрес |

**Пример добавления адреса:**
```bash
curl -X POST http://localhost:3000/addresses \
  -H "Content-Type: application/json" \
  -d '{"address":"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa","label":"Satoshi Wallet"}'
```

###  Курсы `/price`

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/price?currency=USDT` | Актуальные курсы для валюты |

**Пример:**
```bash
curl http://localhost:3000/price?currency=USDT
```

###  История цен `/history`

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/history/:pair` | История цен по паре |
| `GET` | `/history/:pair?from=...&to=...&limit=100` | С фильтрами |

**Пример:**
```bash
curl "http://localhost:3000/history/BTCUSDT?limit=10"
```

###  Блокчейн `/blockchain`

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/blockchain/height` | Текущая высота блокчейна Bitcoin |
| `GET` | `/blockchain/address/:address/balance` | Баланс Bitcoin-адреса |

**Примеры:**
```bash
# Высота блокчейна
curl http://localhost:3000/blockchain/height

# Баланс адреса
curl http://localhost:3000/blockchain/address/1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa/balance
```

###  Аутентификация

Для доступа к защищённым эндпоинтам используйте заголовок `Authorization`:

```bash
curl http://localhost:3000/secure/data \
  -H "Authorization: Bearer <your-jwt-token>"
```

##  Архитектура

Проект построен по принципам **слоистой архитектуры**:

```
┌─────────────────────────────────────────┐
│           HTTP Requests                 │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Middleware (auth, validate)        │  ← Аутентификация, валидация
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           Routes (Controllers)          │  ← Маршруты и обработчики
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Services (Business Logic)        │  ← Логика, внешние API
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Repositories (Data Access)      │  ← Raw SQL запросы
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           SQLite Database               │  ← Хранилище данных
└─────────────────────────────────────────┘
```

### Ключевые компоненты

- **`src/routes/`** — маршруты Express с OpenAPI-аннотациями
- **`src/repositories/`** — работа с БД через raw SQL
- **`src/services/`** — бизнес-логика и интеграции с внешними API
- **`src/middleware/`** — аутентификация, валидация, обработка ошибок
- **`src/tasks/`** — фоновые задачи (синхронизация цен)
- **`src/scheduler/`** — планировщик задач
- **`src/errors/`** — кастомные классы ошибок
- **`src/utils/`** — утилиты (retry-логика)

### Внешние API

| API | Назначение | Таймаут | Retry |
|-----|-----------|---------|-------|
| Binance API | Курсы криптовалют | 30 сек | 3 попытки |
| blockchain.info | Данные Bitcoin | 15 сек | 3 попытки |

##  Тестирование

```bash
# Запуск всех тестов
npm test

# Запуск с покрытием
npm test -- --coverage

# Запуск конкретного файла
npx jest tests/routes/currencies.test.ts
```

### Статистика тестов

```
Test Suites: 11 passed, 11 total
Tests:       57 passed, 57 total
```

### Что покрыто тестами

-  Все эндпоинты (позитивные + негативные сценарии)
-  Валидация входных данных
-  Аутентификация (валидные/невалидные/просроченные токены)
-  Фоновые задачи (планировщик, реестр задач, валидатор)
-  Обработка ошибок (дубликаты, невалидные данные)
-  Логирование

##  Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# Порт приложения
PORT=3000

# Путь к базе данных
DB_PATH=./data/app.sqlite

# Секрет для JWT
AUTH_SECRET=your-secret-key-change-in-production

# Режим работы
NODE_ENV=development
```

Для production-окружения используйте `.env.example` как шаблон.

##  Ограничения и принципы

Согласно техническому заданию:

-  **Без ORM** — только raw SQL через `better-sqlite3`
-  **Данные только в БД** — никаких хранилищ в памяти
-  **БД вне репозитория** — файл БД не коммитится в Git
-  **Таймауты и retry** — для всех внешних API
-  **Graceful shutdown** — корректная остановка фоновых задач
-  **Валидация** — все входные данные проверяются
-  **Покрытие тестами** — каждый эндпоинт покрыт позитивным и негативным тестом

##  Автор

Polina — [@phohlova](https://github.com/phohlova)

##  Ссылки

- [Репозиторий проекта](https://github.com/phohlova/nodejs-practice)
- [Binance API Docs](https://binance-docs.github.io/apidocs/)
- [Blockchain.info API](https://www.blockchain.com/api)