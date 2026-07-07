# La Belle Robe — Frontend

Aplicación web desarrollada en **React + TypeScript** que consume la API REST de la tienda de ropa **La Belle Robe**. Permite a los clientes explorar el catálogo, gestionar su carrito y realizar pedidos, y a los administradores gestionar productos, pedidos y clientes desde un panel dedicado.

---

## URLs

| Recurso | URL |
|---|---|
| Aplicación desplegada | https://la-belle-robe-app.vercel.app |
| Repositorio frontend | https://github.com/MariaGarcia27/la-belle-robe-app |
| API REST (backend) | https://mongo-la-belle-robe.onrender.com |

---

## Tecnologías

- **React 19** + **TypeScript** — biblioteca de UI con tipado estático
- **Vite** — herramienta de build y desarrollo
- **React Router v7** — navegación y rutas
- **Axios** — cliente HTTP para consumir el API
- **Context API** — manejo de estado global (auth + carrito)
- **Tailwind CSS** — estilos utilitarios
- **shadcn/ui** — componentes de interfaz reutilizables
- **Sonner** — notificaciones toast
- **Lucide React** — íconos
- Desplegado en **Vercel**

---

## Estructura del proyecto

```
la-belle-robe-app/
├── .env                      # Variables de entorno (no subir)
├── .env.example              # Plantilla de variables
├── index.html
└── src/
    ├── api/
    │   ├── api.ts            # Instancia axios + interceptores de token
    │   ├── authApi.ts        # Endpoints de autenticación
    │   ├── productosApi.ts   # Endpoints de productos
    │   ├── pedidosApi.ts     # Endpoints de pedidos
    │   └── pagosApi.ts       # Endpoints de pagos
    ├── components/
    │   └── ui/               # Componentes shadcn reutilizables
    ├── context/
    │   ├── AuthContext.tsx   # Estado global de autenticación
    │   └── CartContext.tsx   # Estado global del carrito
    ├── pages/
    │   ├── LoginPage.tsx
    │   ├── RegisterPage.tsx
    │   ├── CatalogPage.tsx
    │   ├── ProductPage.tsx
    │   ├── CartPage.tsx
    │   ├── CheckoutPage.tsx
    │   ├── ConfirmationPage.tsx
    │   ├── OrdersPage.tsx
    │   ├── ProfilePage.tsx
    │   └── admin/
    │       ├── AdminDashboardPage.tsx
    │       ├── AdminProductsPage.tsx
    │       ├── AdminOrdersPage.tsx
    │       └── AdminCustomersPage.tsx
    ├── routes/
    │   ├── ProtectedRoute.tsx  # Redirige a /login si no hay sesión
    │   └── PublicRoute.tsx     # Redirige al inicio si ya hay sesión
    ├── App.tsx                 # Configuración de rutas
    └── main.tsx
```

---

## Instalación local

### Requisitos
- Node.js 18+
- pnpm

```bash
git clone https://github.com/MariaGarcia27/la-belle-robe-app.git
cd la-belle-robe-app
pnpm install
```

Copia el archivo de variables de entorno:

```bash
cp .env.example .env
```

Inicia el servidor de desarrollo:

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Variables de entorno

```env
VITE_API_URL=https://mongo-la-belle-robe.onrender.com
```

> Para desarrollo local puedes apuntar a `http://localhost:5000` si tienes el backend corriendo.

---

## Credenciales de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Admin | admin@labellerobe.com | admin123 |
| Cliente | cliente@labellerobe.com | cliente123 |

---

## Rutas de la aplicación

### Rutas públicas
Accesibles sin iniciar sesión. Si el usuario ya está autenticado, son redirigidas al inicio.

| Ruta | Página |
|---|---|
| `/login` | Inicio de sesión |
| `/register` | Registro de usuario |

### Rutas privadas — Cliente
Solo accesibles con sesión activa. Si no hay sesión, redirigen a `/login`.

| Ruta | Página |
|---|---|
| `/` | Catálogo de productos |
| `/producto/:id` | Detalle del producto con variantes |
| `/carrito` | Carrito de compras |
| `/checkout` | Proceso de pago |
| `/confirmacion` | Confirmación de pedido |
| `/mis-pedidos` | Historial de pedidos del cliente |
| `/perfil` | Perfil del usuario |

### Rutas privadas — Admin
Solo accesibles con sesión de rol `admin`.

| Ruta | Página |
|---|---|
| `/admin` | Dashboard con métricas |
| `/admin/productos` | CRUD completo de productos |
| `/admin/pedidos` | Gestión y cambio de estado de pedidos |
| `/admin/clientes` | Lista de clientes registrados |

---

## Autenticación y seguridad

- El token JWT se almacena en `localStorage` al iniciar sesión
- `AuthContext` expone `login`, `register`, `logout` y `checkAuth` (verifica token al recargar)
- `api.ts` incluye un **interceptor de request** que adjunta el token automáticamente en cada petición
- Un **interceptor de response** detecta errores 401 (token inválido o expirado) y cierra la sesión automáticamente
- `ProtectedRoute` protege todas las rutas privadas — redirige a `/login` si no hay sesión
- `PublicRoute` evita que un usuario autenticado vuelva al login/register
- Las rutas de admin verifican además que el rol sea `admin`

---

## Manejo de estado

| Estado | Dónde | Qué maneja |
|---|---|---|
| Usuario autenticado | `AuthContext` | `user`, `token`, `loading`, `isAuthenticated` |
| Carrito | `CartContext` | items, cantidades, total, agregar/quitar productos |
| Datos del API | `useState` + `useEffect` en cada página | productos, pedidos, pagos |
| Estados de carga | `useState` local | spinners durante fetch |
| Mensajes | `sonner` (toast) | confirmaciones y errores de operaciones |

---

## Consumo del API

Todas las peticiones pasan por `src/api/api.ts`, que configura la URL base y los interceptores:

```
GET  /api/productos               → CatalogPage (listado público)
GET  /api/productos/:id           → ProductPage (detalle)
POST /api/productos               → AdminProductsPage (crear)
PUT  /api/productos/:id           → AdminProductsPage (editar)
DELETE /api/productos/:id         → AdminProductsPage (eliminar)

POST /api/auth/login              → LoginPage
POST /api/auth/register           → RegisterPage
GET  /api/auth/profile            → ProfilePage
GET  /api/auth/usuarios           → AdminCustomersPage

POST /api/pedidos                 → CheckoutPage (crear pedido)
GET  /api/pedidos/mis-pedidos     → OrdersPage
GET  /api/pedidos                 → AdminOrdersPage
PUT  /api/pedidos/:id/estado      → AdminOrdersPage

POST /api/pagos                   → CheckoutPage (crear pago)
GET  /api/pagos/mis-pagos         → OrdersPage
```

---

## Operaciones CRUD desde la interfaz

El panel de administración (`/admin/productos`) permite:

- **Listar** todos los productos con imagen, precio, categoría y stock por variante
- **Crear** producto con nombre, descripción, precio, categoría, imagen y variantes (talla + color + stock)
- **Editar** cualquier campo de un producto existente
- **Eliminar** con diálogo de confirmación (soft delete en el backend)

Cada operación muestra un toast de éxito o error y actualiza la lista automáticamente.

---

## Formularios y validaciones

| Formulario | Validaciones |
|---|---|
| Login | Correo requerido, contraseña mínimo 6 caracteres |
| Register | Nombre, correo válido, contraseña mínimo 6 caracteres |
| Crear/editar producto | Nombre, precio > 0, al menos una variante con stock |
| Checkout | Método de pago requerido, últimos 4 dígitos si es tarjeta |
| Perfil | Nombre requerido, correo válido |

Los errores se muestran inline bajo cada campo y también como notificaciones toast.

---

## Despliegue

- **Plataforma:** Vercel
- **URL pública:** https://la-belle-robe-app.vercel.app
- **API consumida:** https://mongo-la-belle-robe.onrender.com
- El archivo `vercel.json` incluye rewrite de rutas para que React Router funcione correctamente en producción
- La variable `VITE_API_URL` está configurada en el entorno de Vercel
