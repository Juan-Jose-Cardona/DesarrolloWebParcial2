# DesarrolloWebParcial2
Pagina Web usando la API de la NASA, por Victor Manuel Pedroza y Juan José Cardona

El proyecto Nasa NeoWs permite visualizar asteroides cercanos a la Tierra utilizando datos reales de la API NASA NeoWs, representados en un entorno 3D interactivo.
El sistema está dividido en:
1. Frontend (Next.js + React + Three.js): Visualización e interacción
2. Backend (Strapi / API REST): Intermediario de datos

-------------------------------------------------------------------------------------------------------------------------------------

Arquitectura general
NASA API por medio de Backend (Strapi) que es usado por el Frontend (Next.js) con el que el Usuario puede interactuar.

Flujo:
1. El frontend solicita asteroides al backend
2. El backend consulta NASA NeoWs
3. Se retornan datos procesados
4. Se renderizan en escena 3D
5. El usuario interactúa con los objetos

-------------------------------------------------------------------------------------------------------------------------------------

Backend
Ubicación: Backend/agencia-cms

Función principal:
Actúa como middleware entre la API de NASA y el frontend.

Responsabilidades:
- Consumir API de NASA
- Normalizar datos
- Exponer endpoints REST

Endpoint principal:
GET /asteroids

Un ejemplo de lo anterior seria:
[
  {
    "id": "123",
    "name": "Asteroid X",
    "magnitude": 23.5,
    "diameter": {...},
    "velocity": "...",
    "distance": "...",
    "isHazardous": false
  }
]

-------------------------------------------------------------------------------------------------------------------------------------

Frontend
Ubicación: Frontend/

Tecnologías:
- Next.js
- React
- TypeScript
- Three.js (react-three-fiber)

Componentes principales:

page.tsx:
- Controla el estado global
- Maneja carga de datos y errores
- Coordina la comunicación entre componentes

SpaceScene.tsx:
- Renderiza la escena 3D
- Contiene la Tierra, asteroides y satélite
- Permite interacción con los objetos

Navbar.tsx:
- Barra de navegación superior
- Incluye logo, buscador y menú

Buscador.tsx:
- Permite buscar asteroides por nombre
- Filtrado dinámico

Menu.tsx:
- Menú lateral con lista de asteroides
- Permite selección rápida

InfoPanel.tsx:
- Muestra información del asteroide seleccionado
- Incluye datos como magnitud, diámetro, velocidad y distancia

globals.css:
- Estilos globales
- Manejo de diseño responsive
- Estética del espacio

-------------------------------------------------------------------------------------------------------------------------------------

Funcionalidades principales
- Visualización 3D de asteroides
- Consumo de datos reales de NASA
- Interacción con objetos
- Panel informativo dinámico
- Buscador funcional
- Menú lateral
- Diseño responsive
- Persistencia de selección

-------------------------------------------------------------------------------------------------------------------------------------

Responsive Design
El sistema se adapta a dispositivos:
- Desktop
- Tablet
- Mobile

Cambios en móvil:
- Navbar compacta
- Buscador desplegable
- Panel adaptado a pantalla
- Interacción táctil

-------------------------------------------------------------------------------------------------------------------------------------

Tecnologías utilizadas
Frontend:
- Next.js
- React
- TypeScript
- Three.js

Backend:
- Strapi
- Node.js

API externa:
- NASA NeoWs API

-------------------------------------------------------------------------------------------------------------------------------------

Instalación
Frontend:
cd Frontend
npm install
npm run dev

Backend:
cd Backend/agencia-cms
npm install
npm run develop

-------------------------------------------------------------------------------------------------------------------------------------
Para usar la página web de Neows se necesitan ejecutar los siguientes pasos en visual studio 
1. Ejecutar backend npm run dev
2. Ejecutar frontend npm run dev
3. Abrir en navegador: http://localhost:3000
4. Interactuar con la escena

