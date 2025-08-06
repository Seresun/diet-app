# Diet App Frontend

## Настройка API

### Локальная разработка

1. Создайте файл `.env` в корне проекта:
```bash
VITE_API_URL=http://localhost:3000/api
```

### Продакшен (Vercel)

В настройках Vercel добавьте переменную окружения:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Структура API

Приложение ожидает следующие эндпоинты:

- `GET /api/diagnoses` - список всех диагнозов
- `GET /api/diagnoses/:id` - конкретный диагноз
- `GET /api/daily-plan/:diagnosisId` - план питания для диагноза

## Запуск

```bash
npm install
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173/`
