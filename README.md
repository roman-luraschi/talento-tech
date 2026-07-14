# Talento Tech Store

E-commerce en React + TypeScript + Vite para el proyecto final de Talento Lab. Incluye catálogo con Firebase Firestore, autenticación, carrito, favoritos, cupones y panel de administración.

## Requisitos

- Node.js 20 o superior
- Cuenta de [Firebase](https://console.firebase.google.com/) con Authentication (Email/Password) y Firestore habilitados

## Instalación local

```bash
git clone <url-del-repositorio>
cd talento-tech-app
npm install
cp .env.example .env
```

Completá `.env` con los valores de **Firebase Console → Project settings → Your apps → SDK setup and configuration**:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_EMAIL=
```

`VITE_ADMIN_EMAIL` es solo referencia. El rol admin se asigna en Firestore: documento `users/{uid}` con el campo `role: "admin"`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Vista previa del build local |
| `npm run lint` | ESLint |
| `npm run seed:products` | Carga productos de ejemplo en Firestore |
| `npm run seed:equipo` | Carga datos del equipo en Firestore |

Los seeds usan las mismas variables `VITE_FIREBASE_*` del `.env`.

## Funcionalidades principales

- **Auth:** login / registro con Firebase Authentication (`AuthContext`)
- **Carrito:** Context API (`StoreContext`) — agregar, quitar líneas, vaciar carrito, cupones
- **CRUD productos:** panel admin con formulario, edición, modal de confirmación al eliminar
- **Búsqueda y paginación:** filtro en tiempo real + paginador en el catálogo
- **UI:** React Bootstrap, styled-components, React Icons, React Helmet (SEO)
- **Rutas protegidas:** perfil (usuario autenticado) y admin (rol `admin`)

## Despliegue

La salida del build es la carpeta `dist/`.

### Vercel

1. Importá el repositorio en [Vercel](https://vercel.com/).
2. Framework preset: Vite (o Build Command `npm run build`, Output `dist`).
3. Configurá las variables de entorno `VITE_FIREBASE_*` (y opcionalmente `VITE_ADMIN_EMAIL`).
4. El archivo `vercel.json` reescribe las rutas SPA a `index.html` (compatible con React Router).

### Netlify

1. Importá el repositorio en [Netlify](https://netlify.com/).
2. Build command: `npm run build` · Publish directory: `dist`.
3. Configurá las mismas variables de entorno.
4. `netlify.toml` ya incluye el redirect `/* → /index.html` (200).

### Después de publicar

1. Desplegá las reglas de `firestore.rules` desde Firebase Console o CLI.
2. Creá un usuario por la app y asignale `role: "admin"` en `users/{uid}`.
3. Si el catálogo está vacío, corré `npm run seed:products` (y opcionalmente `npm run seed:equipo`).
4. Probá rutas, login, carrito, admin CRUD y responsividad (DevTools / Lighthouse).

## Estructura relevante

```
src/
  components/     # UI, formularios, rutas protegidas
  context/        # Auth, Store (carrito), Products, Search
  firestore/      # Config Firebase y servicios
  pages/          # Páginas de la app
  styles/         # styled-components
scripts/          # Seeds de productos y equipo
```

## Stack

React 19 · TypeScript · Vite · Firebase · React Router · React Bootstrap · styled-components · react-helmet-async · react-icons · react-toastify
