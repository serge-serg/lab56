# Redux Toolkit Integration для сохранения фильтра услуг

## Обзор

В этом проекте Redux Toolkit используется для централизованного хранения фильтра поиска (текста поиска по названию тарифа). Когда пользователь вводит текст в поле поиска, значение сохраняется в Redux store и доступно из любого компонента приложения.

---

## Структура файлов

```
src/
├── store/
│   ├── filterSlice.ts      # Определение состояния и экшенов для фильтра
│   └── index.ts            # Конфигурация Redux store
├── pages/
│   └── TariffsListPage/
│       └── index.tsx       # Компонент, использующий фильтр из store
├── main.tsx                # Подключение store к приложению (Provider)
└── App.tsx
```

---

## 1. `src/store/filterSlice.ts` — Определение состояния и редьюсеров

### Назначение
Это Redux Slice — синтаксический сахар Redux Toolkit для определения состояния, экшенов и редьюсеров в одном месте.

### Код
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface FilterState {
  value: string  // хранит текст фильтра (например, "Базовый")
}

const initialState: FilterState = {
  value: ''  // при запуске приложения фильтр пуст
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<string>) {
      state.value = action.payload  // устанавливает новое значение фильтра
    },
    clearFilter(state) {
      state.value = ''  // очищает фильтр
    }
  }
})

export const { setFilter, clearFilter } = filterSlice.actions  // экшены доступны для диспатча
export default filterSlice.reducer  // редьюсер используется в store
```

### Компоненты

| Часть | Описание |
|-------|---------|
| `FilterState` | TypeScript интерфейс, описывает структуру состояния фильтра |
| `initialState` | Начальное значение (пустая строка) |
| `createSlice()` | RTK функция, создающая slice с редьюсерами |
| `setFilter()` | Экшен для установки нового значения фильтра |
| `clearFilter()` | Экшен для очистки фильтра |
| `filterSlice.actions` | Объект с экспортированными экшенами |
| `filterSlice.reducer` | Редьюсер (функция обновления состояния) |

### Как это работает

1. **На монтировании**: `state.filter.value = ''` (фильтр пуст)
2. **При вызове `dispatch(setFilter("Базовый"))`**:
   - RTK перехватывает экшен
   - Редьюсер обновляет `state.filter.value = "Базовый"`
   - Redux уведомляет все подписанные компоненты об изменении
3. **При вызове `dispatch(clearFilter())`**:
   - `state.filter.value` становится `''`

---

## 2. `src/store/index.ts` — Конфигурация Redux Store

### Назначение
Это точка входа Redux. Здесь регистрируются редьюсеры, конфигурируется store, экспортируются типы.

### Код
```typescript
import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './filterSlice'

const store = configureStore({
  reducer: {
    filter: filterReducer  // регистрируем редьюсер фильтра в store
  },
  // devTools: import.meta.env.MODE !== 'production'
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
```

### Компоненты

| Часть | Описание |
|-------|---------|
| `configureStore()` | RTK функция, создающая Redux store |
| `reducer: { filter: filterReducer }` | Регистрируем редьюсеры (ключ `filter` — имя в state) |
| `RootState` | TypeScript тип всего глобального состояния |
| `AppDispatch` | TypeScript тип функции `dispatch()` |

### Структура state после конфигурации

```typescript
state = {
  filter: {
    value: '' | 'Базовый' | ... // текущее значение фильтра
  }
}
```

---

## 3. `src/main.tsx` — Подключение Store к приложению

### Назначение
Оборачиваем приложение в Redux `Provider`, чтобы любой компонент мог получить доступ к store.

### Код
```tsx
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter} from "react-router-dom";
import { Provider } from 'react-redux'
import store from './store';

const devBase = '/frontend'
const rawBase = import.meta.env.BASE_URL ?? '/'
const prodBase = typeof rawBase === 'string' ? rawBase : '/'
const basename = import.meta.env.MODE === 'development' ? devBase : prodBase
const normalizedBasename = basename.endsWith('/') && basename.length > 1 ? basename.slice(0, -1) : basename

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter basename={normalizedBasename}>
      <App />
    </BrowserRouter>
  </Provider>
)
```

### Ключевые моменты

- `<Provider store={store}>` — оборачивает `App`, делая store доступным для всех компонентов.
- Порядок важен: `Provider` должен быть выше `BrowserRouter` (обычно).
- После обёртки в `Provider` любой компонент может использовать `useDispatch()` и `useSelector()`.

---

## 4. `src/pages/TariffsListPage/index.tsx` — Использование в компоненте

### Назначение
Компонент страницы списка тарифов. Содержит поле для ввода фильтра и интегрируется с Redux для сохранения текста поиска.

### Ключевой код (интеграция Redux)

```tsx
import { useDispatch } from "react-redux";
import { setFilter } from "src/store/filterSlice.ts";
import type { AppDispatch } from "src/store/index.ts";

const TariffsListPage = ({...}: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const filterTariffs = (name: string) => {
    setTariffName(name);        // обновляем локальный state (в пропах)
    dispatch(setFilter(name));  // сохраняем в Redux store
  }

  // ... остальной код компонента
}
```

### Что происходит

1. **`useDispatch<AppDispatch>()`** — получает типизированную функцию `dispatch`.
2. **При вводе в input** → срабатывает `onChange` → вызывается `filterTariffs(value)`.
3. **`setTariffName(name)`** — обновляет локальное состояние (используется для отправки запроса fetch).
4. **`dispatch(setFilter(name))`** — отправляет экшен в Redux:
   - Redux получает экшен `{ type: 'filter/setFilter', payload: 'введённый текст' }`
   - Редьюсер обновляет `state.filter.value`
   - Все компоненты, подписанные на `filter`, получают уведомление об изменении
5. **Компонент перерендеривается** с новым значением (если используется `useSelector`).

---

## Полный поток данных

```
┌─────────────────────────────────────────────────────────────────┐
│                      Пользовательский ввод                      │
│                    (типирует в input)                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              onChange event input поля                          │
│         filterTariffs(e.target.value) вызывается                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                ┌────────┴────────┐
                │                 │
                ▼                 ▼
      ┌──────────────────┐  ┌────────────────────┐
      │ setTariffName()  │  │ dispatch(setFilter)│
      │ (локальное state)│  │  (Redux store)     │
      └──────────────────┘  └────────┬───────────┘
                                     │
                                     ▼
                        ┌──────────────────────────┐
                        │  filterSlice редьюсер    │
                        │ обновляет state.filter   │
                        └────────────┬─────────────┘
                                     │
                                     ▼
                      ┌──────────────────────────┐
                      │ Все компоненты с         │
                      │ useSelector('filter')    │
                      │ получают уведомление     │
                      └──────────────────────────┘
```

---

## Типизация

### RootState — тип состояния
```typescript
type RootState = {
  filter: {
    value: string
  }
}
```

### AppDispatch — тип диспатча
Благодаря этому типу TypeScript подсказывает, какие экшены можно диспатчить.

---

## DevTools (Redux DevTools)

Сейчас DevTools **отключены** (строка закомментирована в `index.ts`):
```typescript
// devTools: import.meta.env.MODE !== 'production'
```

Для включения:
1. Установите расширение Redux DevTools для браузера.
2. Раскомментируйте строку в `src/store/index.ts`.
3. При разработке откройте DevTools (F12 → Redux) и смотрите:
   - Все диспатчиваемые экшены
   - Изменения state после каждого экшена
   - Историю действий (можно откатывать)

---

## Резюме

| Компонент | Роль |
|-----------|------|
| `filterSlice.ts` | Определяет структуру данных и логику изменений (экшены) |
| `index.ts` (store) | Собирает редьюсеры в один Redux store |
| `main.tsx` | Подключает store к приложению через `Provider` |
| `TariffsListPage` | Использует `dispatch()` для отправки экшенов и сохранения данных |

**Результат:** Фильтр поиска централизованно хранится в Redux, безопасно типизирован и доступен из любого компонента приложения через `useSelector()`.
