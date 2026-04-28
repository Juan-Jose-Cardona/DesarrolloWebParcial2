# NASA Space Backend

Backend en Strapi 5 para un proyecto frontend en React/Next.js que consume dos APIs públicas de NASA:

- APOD (Astronomy Picture of the Day)
- Asteroids - NeoWs (Near Earth Object Web Service)

Este backend no usa los content-types de la plantilla original. En su lugar, funciona como **proxy y capa de normalización** para que el frontend consuma rutas más limpias, con validaciones y manejo de errores consistente.

## Requisitos

- Node.js 20 o superior
- npm

## Instalación

```bash
npm install
```

## Configuración

1. Copia el archivo `.env.example` a `.env`
2. Define tu clave de NASA en `NASA_API_KEY`

Ejemplo:

```env
NASA_API_KEY=DEMO_KEY
FRONTEND_URL=http://localhost:3000
```

> `DEMO_KEY` sirve para pruebas, pero tiene límites de uso.

## Desarrollo

```bash
npm run develop
```

## Producción

```bash
npm run build
npm run start
```

## Endpoints disponibles

### Salud del backend

```http
GET /api/nasa/health
```

### APOD del día o por fecha

```http
GET /api/nasa/apod
GET /api/nasa/apod?date=2026-04-20
```

### Rango de APOD o selección aleatoria

```http
GET /api/nasa/apod-range?start_date=2026-04-01&end_date=2026-04-07
GET /api/nasa/apod-range?count=6
```

### Asteroides por rango de fechas

```http
GET /api/nasa/asteroids/feed?start_date=2026-04-01&end_date=2026-04-07
```

### Detalle de un asteroide

```http
GET /api/nasa/asteroids/3542519
```

## Respuesta resumida

Este backend devuelve respuestas normalizadas para facilitar el trabajo en el frontend. Por ejemplo:

- APOD devuelve `item` con `title`, `date`, `imageUrl`, `hdImageUrl`, `mediaType`, `explanation`
- NeoWs feed devuelve `items` aplanados, `total`, `hazardousCount`, `startDate`, `endDate`
- Asteroid lookup devuelve un `item` con diámetro estimado y datos de aproximación

## Estructura relevante

```bash
src/
  api/
    nasa/
      controllers/
        nasa.ts
      routes/
        nasa.ts
      services/
        nasa.ts
        nasa-impl.ts
      utils/
        nasa.ts
```

## Notas

- El rango máximo de NeoWs feed se valida en 7 días.
- El rango máximo de APOD se dejó en 20 días para evitar respuestas muy pesadas.
- CORS está preparado para `http://localhost:3000` y el valor de `FRONTEND_URL`.
