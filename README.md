# Gestor de Biblioteca Personal

Aplicación web fullstack para gestionar libros personales. Permite registrar libros leídos, en progreso y pendientes, buscar títulos desde Google Books, y visualizar estadísticas de lectura.

## Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, TanStack Query, React Router, Recharts |
| **Backend** | FastAPI, Python 3.12+, SQLAlchemy 2.0, Pydantic v2, Alembic |
| **Base de datos** | SQLite (desarrollo) / PostgreSQL (producción) |
| **Infra** | Docker, Docker Compose |

## Estructura

```
biblioteca-personal/
├── frontend/                 # React + Vite + TailwindCSS
│   └── src/
│       ├── components/       # UI components
│       ├── hooks/            # TanStack Query hooks
│       ├── lib/              # Validations, toast helpers
│       ├── pages/            # Route pages
│       ├── services/         # API client + service functions
│       └── types/            # TypeScript interfaces
├── backend/                  # FastAPI + SQLAlchemy
│   └── app/
│       ├── api/              # Route handlers (auth, books, stats, genres)
│       ├── core/             # Config, database, security, dependencies
│       ├── models/           # SQLAlchemy ORM models
│       └── schemas/          # Pydantic request/response models
├── docker-compose.yml        # PostgreSQL + backend + frontend
├── SPEC.md                   # Project specification
└── DESIGN.md                 # ElevenLabs-inspired design system
```

## Requisitos

- Python 3.12+
- Node.js 18+
- npm

## Inicio rápido

### 1. Clonar e instalar dependencias

```bash
# Backend
cd backend
python -m venv .venv
.venv\Scripts\activate     # Windows
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### 2. Configurar variables de entorno

```bash
# Backend — copiar y editar
cp backend/.env.example backend/.env

# Frontend — ya incluye VITE_API_URL=http://localhost:8000/api/v1
```

### 3. Inicializar la base de datos

```bash
cd backend
.venv\Scripts\alembic upgrade head
```

Esto crea las tablas y ejecuta el seed de 20 géneros literarios.

### 4. Iniciar servidores

```bash
# Terminal 1 — Backend (http://localhost:8000)
cd backend
.venv\Scripts\uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

La API se sirve en `http://localhost:8000/api/v1` con documentación interactiva en `http://localhost:8000/docs`.

## Docker

```bash
docker compose up --build
```

Levanta PostgreSQL, backend y frontend.

## API endpoints

| Método | Ruta | Protegido | Descripción |
|--------|------|-----------|-------------|
| POST | `/api/v1/auth/register` | — | Registrar usuario |
| POST | `/api/v1/auth/login` | — | Iniciar sesión |
| GET | `/api/v1/auth/me` | Sí | Usuario actual |
| GET | `/api/v1/books` | Sí | Listar libros (filtro `?status=`) |
| POST | `/api/v1/books` | Sí | Crear libro |
| GET | `/api/v1/books/{id}` | Sí | Detalle del libro |
| PUT | `/api/v1/books/{id}` | Sí | Actualizar metadata de lectura |
| DELETE | `/api/v1/books/{id}` | Sí | Eliminar libro |
| GET | `/api/v1/stats/overview` | Sí | Estadísticas generales |
| GET | `/api/v1/stats/pages-per-month` | Sí | Páginas leídas por mes |
| GET | `/api/v1/stats/favorite-genres` | Sí | Géneros favoritos |
| GET | `/api/v1/stats/top-authors` | Sí | Autores más leídos |
| GET | `/api/v1/google-books/search?q=` | Sí | Buscar en Google Books |
| GET | `/api/v1/genres` | Sí | Listar géneros |

## Funcionalidades

- **Autenticación**: registro, inicio de sesión, JWT, rutas protegidas
- **Biblioteca**: CRUD completo con estados PENDING / READING / COMPLETED
- **Búsqueda**: integración con Google Books API para autocompletar datos
- **Géneros**: 20 géneros predefinidos seleccionables al crear libro
- **Dashboard**: estadísticas con gráficos (Recharts) — totales, páginas por mes, géneros favoritos, top autores
- **Notificaciones**: toasts con animación física (sileo)
- **Skeletons**: estados de carga para mejor experiencia

## Diseño

Inspirado en el sistema de diseño de ElevenLabs (ver `DESIGN.md`):

- Canvas off-white (#f5f5f5), ink warm near-black (#0c0a09)
- EB Garamond para displays, Inter para cuerpo
- CTAs pill-shaped, hairlines sutiles, orbs pastel como atmósfera
- Sin colores neón ni fondos oscuros de herramienta de desarrollo
