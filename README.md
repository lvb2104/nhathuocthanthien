# Nhà Thuốc Thân Thiện 💊

A modern, full-featured pharmacy e-commerce platform built with Next.js 15, React 19, and TypeScript. This project provides a complete solution for managing pharmacy operations with separate interfaces for customers, admins, pharmacists, and delivery employees.

## 🚀 Tech Stack

### Core

- **Framework**: Next.js 15 (App Router)
- **React**: 19.1.0
- **TypeScript**: 5.x
- **Node.js**: 20.x

### Styling & UI

- **CSS Framework**: Tailwind CSS 4
- **UI Components**: Radix UI (shadcn/ui-like components)
- **Icons**: Lucide React, Tabler Icons
- **Theming**: next-themes (dark mode support)
- **Animations**: Tailwind CSS animations

### State Management

- **Global State**: Zustand (`src/store/`)
- **Server State**: TanStack Query (@tanstack/react-query)
- **Authentication**: NextAuth.js
- **Shopping Cart**: use-shopping-cart

### Data & API

- **HTTP Client**: Axios (configured in `src/lib/axios.ts`)
- **Form Handling**: React Hook Form + Zod validation
- **Real-time**: Socket.IO Client (chat, notifications)
- **API Endpoints**: Centralized in `src/configs/apis.ts`

### DevOps & Quality

- **Environment Management**: dotenvx (encrypted .env files)
- **Linting**: ESLint 9
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
- **Type Checking**: TypeScript strict mode

### Additional Features

- **Drag & Drop**: @dnd-kit (sortable, modifiers)
- **Charts**: Recharts
- **Image Gallery**: yet-another-react-lightbox
- **File Upload**: react-dropzone
- **Carousel**: embla-carousel-react
- **Analytics**: Vercel Analytics & Speed Insights
- **Loading States**: nextjs-toploader

---

## 📁 Project Structure

```
nhathuocthanthien/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (dashboard)/          # Dashboard layouts (admin/pharmacist/employee)
│   │   │   ├── admin/            # Admin portal (products, orders, users, stats)
│   │   │   ├── pharmacist/       # Pharmacist portal (prescriptions, chat)
│   │   │   └── employee/         # Employee portal (deliveries)
│   │   ├── (store)/              # Customer-facing store
│   │   │   ├── auth/             # Authentication pages (sign-in, sign-up, forgot password)
│   │   │   ├── products/         # Product browsing & search
│   │   │   ├── categories/       # Product categories
│   │   │   └── user/             # User profile, orders, prescriptions, cart
│   │   ├── api/                  # API routes (NextAuth, webhooks)
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/               # React components
│   │   ├── ui/                   # Radix UI wrappers (button, dialog, form, etc.)
│   │   ├── layouts/              # Layout components (header, sidebar, chat bubble)
│   │   └── widgets/              # Dashboard widgets, cards
│   ├── configs/                  # Configuration files
│   │   └── apis.ts               # Centralized API endpoint definitions
│   ├── hooks/                    # Custom React hooks
│   │   ├── <feature>/            # Feature-specific hooks (e.g., products, orders)
│   │   └── use-*.ts              # Query & mutation hooks (TanStack Query)
│   ├── lib/                      # Utility libraries
│   │   ├── axios.ts              # Axios instance with interceptors
│   │   └── utils.ts              # Utility functions
│   ├── schemas/                  # Zod validation schemas
│   │   └── *.schema.ts           # Form validation schemas
│   ├── services/                 # API service layer
│   │   └── *.ts                  # Feature-specific API calls (wraps axios)
│   ├── store/                    # Zustand global stores
│   ├── types/                    # TypeScript type definitions
│   └── middleware.ts             # Next.js middleware (auth, routing)
├── public/                       # Static assets
├── .env.local                    # Local environment variables (encrypted)
├── .env.production               # Production environment variables (encrypted)
├── .env.keys                     # Dotenvx decryption keys
├── components.json               # shadcn/ui config
├── next.config.ts                # Next.js configuration
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## 🎯 Key Features

### Customer Portal (`(store)`)

- 🛒 **E-commerce**: Product browsing, smart search, categories, cart management
- 💊 **Prescriptions**: Upload prescriptions for pharmacist approval
- 💬 **Live Chat**: Real-time chat with online pharmacists
- 📦 **Order Management**: Track orders, view history, cancel orders
- 🔐 **Authentication**: Sign-up, sign-in, email verification, password reset
- 👤 **Profile Management**: Update profile, manage shipping addresses, change password
- ⭐ **Product Reviews**: Rate and review purchased products

### Admin Dashboard (`admin`)

- 📊 **Statistics & Analytics**: Revenue charts, top products, inventory overview
- 📦 **Product Management**: CRUD operations, batch management, stock movements
- 🛍️ **Order Management**: View, update status, assign delivery
- 👥 **User Management**: View users, lock/unlock accounts
- 🎫 **Promotions**: Create and manage promotional campaigns
- 🚚 **Delivery Management**: Assign delivery employees, track deliveries
- ⭐ **Review Management**: View and delete reviews

### Pharmacist Portal (`pharmacist`)

- 💊 **Prescription Review**: Approve/reject customer prescriptions
- 💬 **Customer Chat**: Real-time chat with customers
- 📋 **Prescription History**: View all reviewed prescriptions

### Employee Portal (`employee`)

- 🚚 **Delivery Management**: View assigned deliveries, update delivery status

---

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js**: 20.x or higher
- **npm**: 9.x or higher
- **Backend API**: Running instance of the pharmacy backend

### 1. Clone the Repository

```bash
cd /home/moda/Code/pharmacy
git clone <repo-url> nhathuocthanthien
cd nhathuocthanthien
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

The project uses **dotenvx** for encrypted environment variables. Decryption keys are stored in `.env.keys`.

#### Local Development (`.env.local`)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your-secret-key>

# Other settings...
```

#### Production (`.env.production`)

Configure production variables similarly with production URLs.

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000** with Turbopack enabled for faster builds.

---

## 📜 Available Scripts

| Command                | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start development server with Turbopack |
| `npm run build`        | Build for production                    |
| `npm start`            | Start production server                 |
| `npm run lint`         | Run ESLint                              |
| `npm run type-check`   | Run TypeScript type checking            |
| `npm run format`       | Format code with Prettier               |
| `npm run format:check` | Check code formatting                   |
| `npm run prepare`      | Setup Husky git hooks                   |

---

## 🏗️ Architecture & Design Patterns

### API Integration Pattern

All API calls follow a strict pattern:

1. **Endpoints** defined in `src/configs/apis.ts`
2. **Services** in `src/services/<feature>.ts` wrap Axios calls
3. **Hooks** in `src/hooks/<feature>/` wrap TanStack Query
4. **Components** consume hooks for data fetching/mutations

#### Example Flow:

```typescript
// 1. API Endpoint Definition (configs/apis.ts)
export const apiEndpoints = {
	products: {
		getAll: '/products',
		getById: (id: number) => `/products/${id}`,
	},
};

// 2. Service Layer (services/products.ts)
import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';

export async function getProducts(): Promise<ProductResponse> {
	const res = await axiosInstance.get(apiEndpoints.products.getAll);
	return res.data;
}

// 3. Hook Layer (hooks/products/use-products.ts)
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/products';

export function useProducts() {
	return useQuery({
		queryKey: ['products'],
		queryFn: getProducts,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
}

// 4. Component Usage
export function ProductList() {
	const { data, isLoading, error } = useProducts();
	// Render logic...
}
```

### State Management Strategy

- **Server State**: TanStack Query (caching, invalidation, optimistic updates)
- **Global Client State**: Zustand (cart, UI preferences)
- **Form State**: React Hook Form (local form state)
- **URL State**: Next.js searchParams (filters, pagination)

### Authentication Flow

The project uses **NextAuth.js** with a custom JWT backend integration:

```
Browser → Next.js Proxy → Backend API
  ↓                           ↓
Has cookies             Returns tokens
  ↓                           ↓
Makes authenticated     Proxy forwards
requests with          refreshToken cookie
credentials: 'include'  to Next.js domain
```

**Key Points**:

- Sign-in flow: Browser → NextAuth → Backend → Cookies set on Next.js domain
- Refresh flow: NextAuth callback reads refreshToken from cookies → Forwards to backend
- Axios interceptor auto-refreshes tokens on 401 responses

---

## 🎨 Coding Standards & Best Practices

### General Rules

1. **Only check auth/role conditions in `layout.tsx` files**, not in individual `page.tsx` files
2. **Handle logic in hooks, render toasts in components** (separation of concerns)
3. **Use server axios for SSR** to boost initial load performance
4. **Use client axios for CSR** to ensure data freshness
5. **Use `staleTime`** to prevent unnecessary refetching

### TanStack Query Patterns

- **`placeholderData`**: Use for list/collection hooks (paginated data, filtered data)
- **`initialData`**: Use for single item hooks (fetching by ID) and non-paginated user-specific data
- **Always invalidate queries** after mutations using `queryClient.invalidateQueries()`

### UI & Localization

- **All user-facing text MUST be in Vietnamese** (labels, placeholders, toasts, etc.)
- Use consistent terminology across the app
- Follow existing Vietnamese translations in the codebase

### Form Handling

- Use **React Hook Form** with **Zod** for validation
- Define schemas in `src/schemas/<feature>.schema.ts`
- Handle errors with `react-toastify`

### Component Organization

- **UI Components**: `src/components/ui/` (reusable Radix UI wrappers)
- **Feature Components**: Co-locate with feature routes when possible
- **Layouts**: `src/components/layouts/` (header, sidebar, etc.)
- **Widgets**: `src/components/widgets/` (dashboard cards, charts)

---

## 🔐 Authentication & Authorization

### Roles

- `CUSTOMER`: Can browse, purchase, upload prescriptions, chat
- `ADMIN`: Full system access (products, orders, users, statistics)
- `PHARMACIST`: Can review prescriptions, chat with customers
- `EMPLOYEE`: Can manage assigned deliveries

### Protected Routes

Routes are protected via `middleware.ts` and layout-level auth checks:

- `/admin/*` → Admin only
- `/pharmacist/*` → Pharmacist only
- `/employee/*` → Employee only
- `/user/*` → Authenticated customers

---

## 📊 API Integration

### Base Configuration

```typescript
// src/lib/axios.ts
const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true, // Important for cookie-based auth
});

// Auto-refresh on 401
axiosInstance.interceptors.response.use(
	response => response,
	async error => {
		if (error.response?.status === 401) {
			// Trigger refresh token flow
		}
		return Promise.reject(error);
	},
);
```

### Service Layer Pattern

All services return `res.data` directly and use descriptive function names:

```typescript
// ✅ Good
export async function getMyOrders() { ... }
export async function createOrder(data: CreateOrderDto) { ... }
export async function updateOrderStatus(id: number, status: OrderStatus) { ... }

// ❌ Bad
export async function fetchOrders() { ... }
export async function update(id, data) { ... }
```

---

## 🧪 Testing & Quality Assurance

### Pre-commit Hooks (Husky)

- ESLint auto-fix
- Prettier formatting
- Type checking

### Type Safety

- **Strict TypeScript** mode enabled
- All API responses typed in `src/types/`
- Zod schemas for runtime validation

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Environment Variables

Ensure `.env.production` is properly configured with:

- Production API URL
- NextAuth secret
- Socket.IO URL
- Analytics keys (if using Vercel)

---

## 🐛 Common Issues & Solutions

### Issue: Server doesn't have browser cookies

**Cause**: Server-side requests don't automatically include browser cookies.

**Solution**: Use the proxy pattern implemented in `middleware.ts` to forward cookies from the browser to Next.js server, then to backend.

### Issue: Query refetches too often

**Solution**: Set appropriate `staleTime` in TanStack Query hooks:

```typescript
useQuery({
	queryKey: ['products'],
	queryFn: getProducts,
	staleTime: 1000 * 60 * 5, // 5 minutes
});
```

### Issue: Form validation errors not showing

**Solution**: Ensure Zod schema errors are mapped to React Hook Form:

```typescript
const form = useForm({
	resolver: zodResolver(mySchema),
});
```

---

## 📚 Key Dependencies Explained

| Package                 | Purpose                            |
| ----------------------- | ---------------------------------- |
| `next`                  | React framework with SSR/SSG       |
| `@tanstack/react-query` | Server state management, caching   |
| `axios`                 | HTTP client with interceptors      |
| `next-auth`             | Authentication framework           |
| `zustand`               | Global state management (cart, UI) |
| `react-hook-form`       | Form state management              |
| `zod`                   | Schema validation                  |
| `socket.io-client`      | Real-time chat & notifications     |
| `recharts`              | Dashboard charts                   |
| `@dnd-kit/*`            | Drag & drop (sortable lists)       |
| `lucide-react`          | Icon library                       |
| `react-toastify`        | Toast notifications                |
| `dotenvx`               | Encrypted environment variables    |

---

## 🧑‍💻 Contributing

### Code Style

- Follow existing patterns in the codebase
- Use TypeScript for all new files
- Write meaningful commit messages
- Ensure all lint/format checks pass

### Pull Request Process

1. Fork and create a feature branch
2. Make changes following coding standards
3. Test thoroughly (manual testing)
4. Run `npm run lint` and `npm run type-check`
5. Submit PR with clear description

---

## 📞 Support & Contact

For issues, questions, or contributions, please contact the development team.

---

## 📝 License

This project is proprietary software for Nhà Thuốc Thân Thiện.

---

## 🎯 Visual Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ Has cookies in memory
       │ Makes request with credentials: 'include'
       ↓
┌──────────────────┐         ┌─────────────┐
│  Next.js Server  │────────→│   Backend   │
│ (Node process)   │         │    API      │
└──────────────────┘         └─────────────┘
       ❌ No cookies attached
       (server doesn't know about browser cookies)
```

**Solution Flow**:

- **Sign-in**: Browser → Next.js proxy → Backend → Proxy forwards cookies → Browser receives `refreshToken` cookie on Next.js domain
- **Refresh**: NextAuth callback → `getIncomingCookieHeader()` → Finds `refreshToken` cookie (same domain!) → Proxy forwards to backend → Success!

---

**Built with ❤️ by the Nhà Thuốc Thân Thiện team**
