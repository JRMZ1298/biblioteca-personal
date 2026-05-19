# SPEC.md — Gestor de Biblioteca Personal

## 1. Información General

### Nombre del Proyecto
**Gestor de Biblioteca Personal**

### Descripción
Aplicación web para gestionar libros personales permitiendo registrar libros leídos, en progreso y pendientes.  
La aplicación integrará la API de Google Books para autocompletar información de libros y ofrecerá estadísticas visuales sobre hábitos de lectura.

---

# 2. Objetivo del Proyecto

Construir una plataforma que permita a los usuarios:

- Organizar su biblioteca personal.
- Llevar seguimiento de lectura.
- Consultar estadísticas de hábitos de lectura.
- Buscar libros fácilmente mediante integración con Google Books.
- Mejorar habilidades de desarrollo fullstack usando APIs externas, bases de datos relacionales y visualización de datos.

---

# 3. Alcance

## Incluye

- Autenticación de usuarios.
- CRUD de libros personales.
- Estados de lectura:
  - Pendiente
  - En progreso
  - Leído
- Integración con Google Books API.
- Dashboard de estadísticas.
- Sistema de géneros y autores.
- Persistencia en base de datos.

## No Incluye (MVP)

- Sistema social.
- Compartir bibliotecas.
- Reseñas públicas.
- Marketplace de libros.
- Lectura de ebooks.
- Sincronización offline.

---

# 4. Stack Tecnológico Sugerido

## Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- React Query / TanStack Query
- React Router
- Recharts

## Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic
- Alembic

## Base de Datos

- PostgreSQL

## APIs Externas

- Google Books API

## DevOps

- Docker
- Docker Compose
- Render / Railway / Fly.io

---

# 5. Arquitectura General

```text
Frontend (React)
       |
       v
Backend API (FastAPI)
       |
       v
PostgreSQL
       |
       v
Google Books API
```

---

# 6. Funcionalidades Principales

# 6.1 Autenticación

## Requerimientos

- Registro de usuario
- Inicio de sesión
- Logout
- Protección de rutas
- JWT Authentication

## Entidades

### Usuario

| Campo | Tipo |
|---|---|
| id | UUID |
| username | string |
| email | string |
| password_hash | string |
| created_at | datetime |

---

# 6.2 Gestión de Biblioteca

## Requerimientos

- Agregar libros manualmente
- Buscar libros desde Google Books
- Editar información
- Eliminar libros
- Cambiar estado de lectura

## Estados

- PENDING
- READING
- COMPLETED

## Entidad Libro

| Campo | Tipo |
|---|---|
| id | UUID |
| title | string |
| author | string |
| description | text |
| thumbnail | string |
| pages | integer |
| published_date | string |
| google_books_id | string |
| created_at | datetime |

---

# 6.3 Relación Usuario ↔ Libros

## Entidad UserBook

| Campo | Tipo |
|---|---|
| id | UUID |
| user_id | FK |
| book_id | FK |
| status | enum |
| current_page | integer |
| started_at | datetime |
| finished_at | datetime |
| rating | integer |
| notes | text |

---

# 6.4 Géneros

## Relación Many-to-Many

Un libro puede tener múltiples géneros y un género puede pertenecer a múltiples libros.

## Entidad Genre

| Campo | Tipo |
|---|---|
| id | UUID |
| name | string |

## Tabla Intermedia

### BookGenre

| Campo | Tipo |
|---|---|
| book_id | FK |
| genre_id | FK |

---

# 6.5 Integración Google Books API

## Objetivo

Permitir búsqueda automática de libros y autocompletar información.

## Funcionalidades

- Buscar por título
- Buscar por autor
- Obtener portada
- Obtener descripción
- Obtener número de páginas
- Obtener categorías

## Endpoint Externo

```http
GET https://www.googleapis.com/books/v1/volumes?q=harry+potter
```

---

# 7. Estadísticas

## Dashboard

### Métricas

- Total de libros leídos
- Páginas leídas por mes
- Géneros favoritos
- Autores más leídos
- Promedio de páginas por libro
- Tiempo promedio de lectura

## Visualizaciones

| Estadística | Tipo |
|---|---|
| Páginas por mes | Line Chart |
| Géneros favoritos | Pie Chart |
| Autores más leídos | Bar Chart |
| Estados de lectura | Donut Chart |

---

# 8. Diseño de Base de Datos

## Relaciones

```text
User
 └── UserBook
        ├── Book
        │     └── BookGenre
        │              └── Genre
```

---

# 9. Endpoints API

# Auth

| Método | Endpoint |
|---|---|
| POST | /auth/register |
| POST | /auth/login |
| GET | /auth/me |

---

# Books

| Método | Endpoint |
|---|---|
| GET | /books |
| POST | /books |
| GET | /books/{id} |
| PUT | /books/{id} |
| DELETE | /books/{id} |

---

# Google Books

| Método | Endpoint |
|---|---|
| GET | /google-books/search |

---

# Stats

| Método | Endpoint |
|---|---|
| GET | /stats/overview |
| GET | /stats/pages-per-month |
| GET | /stats/favorite-genres |
| GET | /stats/top-authors |

---

# 10. Reglas de Negocio

- Un usuario no puede registrar el mismo libro dos veces.
- Un libro puede existir globalmente y pertenecer a múltiples usuarios.
- La calificación debe estar entre 1 y 5.
- `finished_at` solo puede existir si el estado es COMPLETED.
- `current_page` no puede superar el total de páginas.

---

# 11. Requerimientos No Funcionales

## Rendimiento

- Respuesta API menor a 500ms en consultas normales.
- Cache para búsquedas frecuentes.

## Seguridad

- Contraseñas hasheadas con bcrypt.
- JWT con expiración.
- Validación de inputs.

## Escalabilidad

- Arquitectura desacoplada frontend/backend.
- Uso de migraciones con Alembic.

---

# 12. UI/UX

## Pantallas Principales

### Autenticación

- Login
- Registro

### Biblioteca

- Lista de libros
- Filtros por estado
- Buscador

### Detalle de Libro

- Información completa
- Progreso de lectura
- Notas
- Rating

### Dashboard

- Estadísticas
- Gráficas

---

# 13. Posibles Mejoras Futuras

- Modo oscuro
- Exportar biblioteca
- Sistema de recomendaciones
- Objetivos de lectura
- Integración con Goodreads
- App móvil
- Notificaciones
- OCR para escanear ISBN
- Lectura social

---

# 14. Retos Técnicos

## Backend

- Manejo correcto de relaciones Many-to-Many.
- Optimización de consultas estadísticas.
- Manejo de rate limits de Google Books API.

## Frontend

- Manejo de estado asíncrono.
- Cache de datos.
- Renderizado eficiente de gráficas.

---

# 15. Aprendizajes Esperados

## Backend

- FastAPI avanzado
- SQLAlchemy ORM
- Relaciones SQL
- Integración con APIs externas
- JWT Authentication

## Frontend

- Manejo de estado
- Consumo de APIs
- Visualización de datos
- Arquitectura escalable React

## DevOps

- Dockerización
- Deploy fullstack
- Variables de entorno

---

# 16. MVP Recomendado

## Fase 1

- Autenticación
- CRUD de libros
- Estados de lectura

## Fase 2

- Integración Google Books
- Dashboard básico

## Fase 3

- Estadísticas avanzadas
- UI refinada
- Deploy

---

# 17. Criterios de Éxito

El proyecto se considera exitoso si:

- Los usuarios pueden gestionar libros correctamente.
- Las búsquedas desde Google Books funcionan.
- Las estadísticas muestran datos precisos.
- El sistema mantiene buen rendimiento.
- El código es mantenible y escalable.
