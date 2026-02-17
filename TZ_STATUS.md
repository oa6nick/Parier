# Pariall — Техническое задание и статус проекта

**Дата:** 17 февраля 2026  
**Платформа:** P2P предсказания на реальные события

---

## 1. ЧТО СЕЙЧАС ЕСТЬ

### 1.1 Фронтенд (Next.js 15, React 19, TypeScript)

| Компонент | Статус | Описание |
|-----------|--------|----------|
| **Страницы** | ✅ Готово | 23 страницы: лента, создание пари, профиль, кошелёк, рейтинг, админка, сообщения, поддержка, onboarding, auth и др. |
| **UI-компоненты** | ✅ Готово | Button, Input, Avatar, Tag, BetCard, BetModal, DepositModal, WalletBalance, TransactionList и др. |
| **Локализация** | ✅ Готово | next-intl, EN + RU |
| **Дизайн** | ✅ Готово | Tailwind, primary purple, адаптив, mobile-first |
| **Брендинг** | ✅ Готово | Pariall, логотип, favicon, токен PAR |

**Источники данных фронтенда:**
- **Моки** — `lib/mockData/` (bets, users, wallet, categories, transactions)
- **API routes** — `/api/bets` (создание пари), `/api/admin/credit-tokens` — пишут в моки, не в БД

### 1.2 Бэкенд (Go, Gin)

| Компонент | Статус | Описание |
|-----------|--------|----------|
| **Сервер** | ✅ Готово | `back/server/` — Gin, GORM, Swagger |
| **API** | ✅ Готово | `/api/v1/parier/*` — категории, ставки, лайки, комментарии |
| **Auth** | ✅ Готово | Keycloak (OAuth2, login-code, profile, logout) |
| **Media** | ✅ Готово | MinIO S3, загрузка файлов |
| **MCP** | ✅ Готово | MCP endpoints (опционально) |

**Эндпоинты бэкенда (требуют Bearer token):**
- `POST /api/v1/parier/categories` — справочник категорий
- `POST /api/v1/parier/verification-sources` — источники проверки
- `POST /api/v1/parier/bet` — список ставок (фильтры, пагинация)
- `PUT /api/v1/parier/bet` — создание ставки
- `POST /api/v1/parier/bet/:id/like`, `unlike` — лайки
- `POST /api/v1/parier/bet/:id/comments` — комментарии
- `PUT /api/v1/auth/login-code` — логин по code (OAuth callback)

### 1.3 База данных

| Компонент | Статус | Описание |
|-----------|--------|----------|
| **Схема** | ✅ Готово | PostgreSQL, Liquibase, ~33 таблицы |
| **Модели** | ✅ Готово | t_d_category, t_bet, t_bet_comment, t_localization, t_user и др. |
| **Миграции** | ✅ Готово | `back/dbms/` — init + schema changelogs |

### 1.4 Инфраструктура

| Компонент | Статус | Описание |
|-----------|--------|----------|
| **Docker Compose** | ✅ Готово | frontend, postgres, backend, keycloak, minio, n8n, init-db |
| **Makefile** | ✅ Готово | install, dev, build, docker-* команды |

---

## 2. ЧТО НЕ ГОТОВО / НЕ СВЯЗАНО

### 2.1 Интеграция фронтенд ↔ бэкенд

| Задача | Описание |
|--------|----------|
| **API-клиент** | Фронт ходит в `/api/bets` (Next.js route) и моки. Нужен клиент на `NEXT_PUBLIC_API_URL` + прокси |
| **Формат запросов** | Бэкенд: `BetCreateRequest` (category_id, verification_source_id[], status_id, type_id, amount, coefficient, deadline). Фронт: title, shortDescription, outcome, categoryId, betAmount, coefficient — **разные схемы** |
| **Auth** | Фронт: localStorage + mock users. Бэкенд: Keycloak OAuth2. Нужна интеграция NextAuth/OIDC или Keycloak JS |
| **Локализация** | Бэкенд: `t_l_word`, `t_localization` — БД. Фронт: `messages/en.json`, `messages/ru.json` — JSON. Нужно решить: единый источник или синхронизация |

### 2.2 Отсутствующие части

| Компонент | Описание |
|-----------|----------|
| **ApiProvider / Redux** | В ветке `new_back` есть `app/layout.tsx` с ApiProvider, StoreComponent, Redux — не перенесено в main |
| **Кошелёк / токены** | Фронт: моки. Бэкенд: нет явной модели для PAR/токенов и админ-кредитования |
| **Реферальная система** | Фронт: UI есть. Бэкенд: нет эндпоинтов |
| **Админка** | Фронт: страница `/admin` с credit-tokens. Бэкенд: нет соответствующего API |
| **Реальные ставки** | Фронт: BetModal вызывает мок. Бэкенд: есть CreateBet, но нет «принять ставку» (bet amount) |

### 2.3 Схема данных: расхождения

| Фронт | Бэкенд |
|-------|--------|
| `categoryId` (string) | `category_id` (CK ID из справочника) |
| `title`, `shortDescription`, `outcome` | `title`, `description` (один текст) |
| `verificationSource` (строка) | `verification_source_id[]` (массив ID) |
| `betAmount`, `coefficient` | `amount`, `coefficient` (строка) |
| Нет `status_id`, `type_id` | Обязательны в бэкенде |

---

## 3. ОЦЕНКА ВРЕМЕНИ НА ЗАВЕРШЕНИЕ

### 3.1 Минимальный MVP (фронт + бэкенд работают вместе)

| Фаза | Задачи | Время |
|------|--------|-------|
| **1. Auth** | Настроить NextAuth / Keycloak OIDC, заменить mock-логин на реальный | 1–2 дня |
| **2. API-прокси** | Создать Next.js API routes как прокси к бэкенду, или настроить rewrites | 0.5 дня |
| **3. Маппинг форм** | Адаптировать CreateBet на фронте под формат бэкенда (BetCreateRequest) | 1 день |
| **4. Справочники** | Загружать категории/verification sources из бэкенда вместо моков | 0.5 дня |
| **5. Лента ставок** | Заменить моки на `POST /api/v1/parier/bet` с пагинацией | 1 день |
| **6. Создание ставки** | Связать форму создания с `PUT /api/v1/parier/bet` | 0.5 дня |

**Итого MVP:** ~4–5 дней (1 разработчик)

### 3.2 Полная интеграция

| Фаза | Задачи | Время |
|------|--------|-------|
| **7. Кошелёк** | Модель токенов в БД, API баланса, депозиты/выводы | 2–3 дня |
| **8. Принятие ставок** | Логика «принять пари» (bet amount), обновление пула | 2 дня |
| **9. Админка** | API credit-tokens, правила (all, new_users, low_balance, active) | 1 день |
| **10. Рефералы** | Модель, API, интеграция с UI | 1–2 дня |
| **11. Медиа** | Загрузка изображений к ставкам через MinIO | 1 день |
| **12. Локализация** | Синхронизация JSON ↔ БД или выбор единого источника | 1–2 дня |

**Итого полная интеграция:** +8–11 дней

### 3.3 Сводка

| Сценарий | Время |
|----------|-------|
| **MVP (работающая связка)** | 4–5 дней |
| **Полная интеграция** | 12–16 дней |
| **+ тесты, документация, деплой** | +2–3 дня |

---

## 4. РЕКОМЕНДУЕМЫЙ ПОРЯДОК РАБОТ

1. **Запуск стека** — `docker-compose up`, проверка health бэкенда и БД.
2. **Auth** — Keycloak + NextAuth, чтобы фронт получал реальный токен.
3. **Прокси/rewrites** — настроить `NEXT_PUBLIC_API_URL` и CORS.
4. **Справочники** — категории и verification sources из API.
5. **Лента** — GetBets вместо моков.
6. **Создание ставки** — маппинг формы → BetCreateRequest.
7. Дальше — кошелёк, рефералы, админка по приоритету.

---

## 5. ФАЙЛЫ ДЛЯ СТАРТА

- **API:** `back/server/docs/swagger.yaml`, `back/server/internal/handlers/parier.go`
- **Модели:** `back/server/internal/models/dto.go`, `back/server/internal/models/parier.go`
- **Фронт:** `app/[locale]/create/page.tsx`, `app/api/bets/route.ts`, `lib/mockData/`
- **Конфиг:** `docker-compose.yml`, `back/server/.env`, `.env`
