# 🛒 E-Commerce Frontend

Frontend moderno de comercio electrónico construido con **React 19**, **TypeScript** y **Vite**. Se conecta a un backend NestJS REST API y cuenta con control de acceso basado en roles, actualizaciones en tiempo real vía WebSockets y diseño con Material UI.

---

## 📋 Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Ejecutar la Aplicación](#ejecutar-la-aplicación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Autenticación y Autorización](#autenticación-y-autorización)
- [Rutas de la Aplicación](#rutas-de-la-aplicación)
- [WebSockets — Tiempo Real](#websockets--tiempo-real)
- [Scripts Disponibles](#scripts-disponibles)
- [Deploy en Producción](#deploy-en-producción)

---

## 🧰 Tecnologías

| Categoría          | Librería / Herramienta                  |
|--------------------|-----------------------------------------|
| UI Framework       | React 19                                |
| Lenguaje           | TypeScript 5.9                          |
| Build Tool         | Vite 7                                  |
| Componentes UI     | Material UI (MUI) 7 + Emotion           |
| Estado global      | Redux Toolkit 2 + React-Redux           |
| Cliente HTTP       | Axios 1.x                               |
| Enrutamiento       | React Router DOM 7                      |
| Tiempo real        | Socket.IO Client 4                      |
| Fuentes            | Inter (via @fontsource/inter)           |
| Linting            | ESLint 9 + TypeScript-ESLint            |

---

## ✅ Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)
- Backend NestJS corriendo (por defecto en `http://localhost:3000`)

---

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/LucasSoftware12/reactjs-ecommerce
cd reactjs-ecommerce

# 2. Instalar dependencias
npm install
```

---

## 🔧 Variables de Entorno

Creá un archivo `.env.development` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

Para producción, creá un archivo `.env.production` con las URLs correspondientes:

```env
VITE_API_URL=http://3.145.134.208:3000
VITE_SOCKET_URL=http://3.145.134.208:3000
```

---

## ▶️ Ejecutar la Aplicación

```bash
# Modo desarrollo (HMR habilitado)
npm run dev
```

La app estará disponible en **http://localhost:5173**

---

## 🗂️ Estructura del Proyecto

```
src/
├── api/                  # Capa HTTP. Una función por endpoint, sin lógica de negocio
│   ├── axios.ts          # Instancia Axios con interceptores JWT
│   ├── auth.api.ts       # Login y Register
│   ├── product.api.ts    # CRUD de productos y activación
│   ├── role.api.ts       # Asignación de roles
│   └── user.api.ts       # Perfil de usuario
│
├── components/           # Componentes UI reutilizables
│   └── layout/
│       ├── MainLayout.tsx  # Shell principal con Navbar y <Outlet />
│       └── Navbar.tsx      # Barra de navegación
│
├── hooks/
│   ├── useAuth.ts        # Abstrae el acceso al estado de auth desde Redux
│   └── useRedux.ts       # useDispatch y useSelector tipados
│
├── pages/                # Vistas organizadas por dominio funcional
│   ├── auth/             # LoginPage, RegisterPage
│   ├── dashboard/        # DashboardPage (con WebSocket)
│   ├── products/         # ProductListPage, ProductDetailPage, CreateProductPage
│   ├── profile/          # ProfilePage
│   └── roles/            # AssignRolePage
│
├── router/
│   ├── AppRouter.tsx     # Definición de rutas y control de acceso por roles
│   └── ProtectedRoute.tsx# Guardia de ruta por autenticación y rol
│
├── store/
│   ├── store.ts          # Configuración del store Redux
│   └── slices/           # auth.slice (token, user, isAuthenticated)
│
├── theme/                # Configuración del tema MUI
├── types/                # Interfaces TypeScript compartidas
├── App.tsx
└── main.tsx
```

---

## 🔐 Autenticación y Autorización

La autenticación usa **JWT Bearer Token**:

1. Al hacer login, el token se guarda en `localStorage` y en el store de Redux.
2. Cada request HTTP lo incluye automáticamente vía el interceptor de Axios.
3. Si el backend responde `401`, el interceptor desloguea al usuario y redirige a `/login`.
4. Al recargar la app, el `auth.slice` hidrata el estado desde `localStorage` para sesiones persistentes.

> **Trade-off consciente**: el token en `localStorage` es simple de implementar pero vulnerable a XSS. En producción real se implementaría con httpOnly cookies y refresh tokens.

### Sistema de roles

| Rol ID | Nombre   | Acceso                                              |
|--------|----------|-----------------------------------------------------|
| 1      | Customer | Dashboard, Perfil, detalle de producto              |
| 2      | Merchant | + Lista de productos, Crear producto                |
| 3      | Admin    | + Asignar roles                                     |

---

## 🗺️ Rutas de la Aplicación

| Ruta               | Acceso               | Descripción                          |
|--------------------|----------------------|--------------------------------------|
| `/login`           | Público (solo guests)| Formulario de login                  |
| `/register`        | Público (solo guests)| Formulario de registro               |
| `/dashboard`       | Autenticado          | Dashboard principal con WebSocket    |
| `/profile`         | Autenticado          | Perfil del usuario                   |
| `/products`        | Roles 2 y 3          | Gestión de productos                 |
| `/products/create` | Roles 2 y 3          | Crear nuevo producto                 |
| `/roles/assign`    | Solo Rol 3           | Asignar roles a usuarios             |

> Los usuarios autenticados son redirigidos de `/login` y `/register` al `/dashboard`.

---

## 🔌 WebSockets — Tiempo Real

La app usa **Socket.IO Client** para conectarse al backend en `VITE_SOCKET_URL`. Esto permite recibir notificaciones en tiempo real sin polling.

| Evento                | Dirección        | Descripción                                          |
|-----------------------|------------------|------------------------------------------------------|
| `newProductActivated` | Server → Client  | Toast instantáneo cuando un admin activa un producto |

**Para probar**: abrí dos sesiones del browser. Desde una sesión de admin activá un producto. En la otra sesión (cliente) aparece el toast en tiempo real sin refrescar la página.

---

## 📜 Scripts Disponibles

| Comando           | Descripción                                |
|-------------------|--------------------------------------------|
| `npm run dev`     | Servidor de desarrollo con HMR habilitado  |
| `npm run build`   | Type-check y build para producción         |
| `npm run preview` | Preview del build de producción en local   |
| `npm run lint`    | Ejecutar ESLint en todo el proyecto        |

---

## 🚀 Deploy en Producción

| Servicio   | URL                       |
|------------|---------------------------|
| Frontend   | http://3.145.134.208      |
| Backend    | http://3.145.134.208:3000 |

### 🔑 Credenciales de prueba

| Rol      | Email             | Contraseña |
|----------|-------------------|------------|
| Admin    | admin@admin.com   | 12345678   |
| Customer | Registrate en `/register` | — |