# Testimonies.com Admin Dashboard — Agent Guidelines

## 1. Project Overview

This is the admin dashboard for Testimonies.com. Built with React Router 7, TypeScript, Tailwind CSS, and Redux Toolkit. It provides internal tools for managing users, content, subscriptions, promotions, and platform configuration.

## 2. Technology Stack

### 2.1 Core Technologies
- **Framework**: React Router 7 (SSR enabled)
- **Language**: TypeScript (strict mode — no `any`)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios with interceptors
- **Build Tool**: Vite
- **Encryption**: crypto-js (token storage)
- **Notifications**: React Toastify

### 2.2 Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: `npm run typecheck`
- **Git Hooks**: Husky + lint-staged

## 3. Project Structure

```
app/
├── api/                    # Axios API modules (one per domain)
│   ├── axios.ts           # Single Axios instance with interceptors
│   ├── adminAuth.ts
│   ├── adminUsers.ts
│   ├── adminTestimonies.ts
│   ├── adminSubscriptions.ts
│   ├── adminPromotions.ts
│   ├── adminContent.ts
│   ├── adminAuditLogs.ts
│   └── adminRolesPermissions.ts
├── common/                 # Shared reusable components
│   ├── FilterBar.tsx
│   ├── Modal.tsx
│   ├── PageHeader.tsx
│   └── Table.tsx
├── functions/              # Pure utility functions
│   ├── encryption.ts      # crypto-js token encryption/decryption
│   ├── environmentVariables.ts
│   ├── feedback.ts        # Toast helpers
│   ├── security.ts        # Validation, sanitization, rate limiting
│   └── userSession.ts     # Session read/write/clear
├── hooks/                  # Custom React hooks
├── layout/                 # Layout components
│   ├── auth-layout/
│   └── dashboard-layout/
├── routes/                 # Route components (one folder per section)
│   ├── auth/
│   ├── dashboard/
│   ├── users/
│   ├── testimonies/
│   ├── subscriptions/
│   ├── promotions/
│   ├── content/
│   ├── roles-permissions/
│   ├── audit-logs/
│   └── settings/
├── store/                  # Redux store
│   ├── slices/
│   ├── hooks.ts
│   └── index.ts
├── types/                  # TypeScript types
│   ├── admin-resources.ts
│   ├── api.ts
│   ├── auth.ts
│   └── enums.ts
├── app.css                 # Global styles and design system classes
├── root.tsx
└── routes.ts
```

## 4. Naming Conventions

- **Files/Directories**: camelCase for files (`adminUsers.ts`), kebab-case for route folders (`roles-permissions/`)
- **Components**: PascalCase (`UserTable`, `FilterBar`)
- **Hooks**: camelCase prefixed with `use` (`useAdminUsers`)
- **Types/Interfaces**: PascalCase (`AdminUser`, `SubscriptionPlan`)
- **Constants/Enums**: PascalCase for enum names, UPPER_SNAKE_CASE for values
- **Utility functions**: camelCase (`sanitizeHtml`, `isValidEmail`)

## 5. Development Rules

### 5.1 TypeScript
- Strict mode is always on. Never use `any`.
- All API response shapes must have a corresponding type in `app/types/`.
- Use enums from `app/types/enums.ts` for status values, roles, and categories.

### 5.2 Components
- Use functional components only.
- Reuse `common/` components (Table, Modal, FilterBar, PageHeader) for all dashboard pages — do not rebuild them.
- Every page that loads data must handle loading, empty, and error states.
- Destructive actions (delete, ban, deactivate) must use a confirmation Modal before executing.

### 5.3 API Calls
- All API calls go through the modules in `app/api/`. Never use Axios directly in a component or route.
- The single Axios instance in `app/api/axios.ts` injects the admin JWT and `x-api-key` header automatically.
- On 401/403, the interceptor clears the session and redirects to `/auth/login`.

```typescript
// Correct — use the API module
import { getUsers } from '~/api/adminUsers';

// Wrong — never do this in a component
import axios from 'axios';
axios.get('/admin/users');
```

### 5.4 Authentication & Session
- Token is stored encrypted via `app/functions/encryption.ts` — never store plain JWT.
- Session helpers (`app/functions/userSession.ts`) are the only place that reads/writes session data.
- Check session expiry on every protected route load.
- Logout clears all session data and redirects to `/auth/login`.

### 5.5 Security Functions
Always use the utilities in `app/functions/security.ts`:
- `sanitizeHtml()` before rendering any user-generated content.
- `isValidEmail()`, `isStrongPassword()`, `isValidObjectId()` for input validation.
- `checkRateLimit()` / `clearRateLimit()` for sensitive operations (login, OTP).
- `escapeHtml()` when inserting user content into strings.

### 5.6 Styling
- Use Tailwind utility classes and the design system classes defined in `app.css`.
- Use `.btn-primary`, `.btn-secondary`, `.btn-danger` for all action buttons.
- Use `.badge-*` variants for all status indicators.
- Use `.card` for all content containers.
- Support both light and dark modes where applicable.
- Do not write custom CSS outside `app.css` unless absolutely necessary.

### 5.7 Tables & Pagination
- All list views use the shared `Table` component.
- Always implement server-side pagination — never load unbounded lists.
- Always implement search and filter via `FilterBar` component.
- Debounce search inputs (300ms minimum).

### 5.8 Forms
- Validate all inputs before submission using `security.ts` helpers.
- Disable submit buttons while a request is in flight.
- Show field-level error messages.
- Use `feedback.ts` toast helpers for success and error notifications — never use `alert()`.

### 5.9 Redux
- Use Redux only for global state: admin session, notification counts, sidebar state.
- Do not put API response data in Redux — use component-level state or React Query if added.
- Slices live in `app/store/slices/`.
- Use typed hooks from `app/store/hooks.ts` (`useAppDispatch`, `useAppSelector`).

## 6. Route Structure Rules

- All authenticated routes are nested under the `dashboard-layout`.
- All auth routes (login, OTP) are nested under `auth-layout`.
- Route components are thin — they compose `common/` components and call API modules.
- Heavy business logic belongs in `app/functions/` or `app/api/`, not in route components.

## 7. Error Handling

- Wrap all API calls in try/catch.
- Show user-friendly error messages via `feedback.ts` toasts.
- Log errors to the console in development; suppress in production.
- Never expose raw error stack traces or API internals to the UI.

```typescript
try {
  const data = await banUser(userId, reason);
  showSuccess('User banned successfully.');
} catch (error) {
  showError(getErrorMessage(error));
}
```

## 8. Audit Sensitivity

- Every destructive or sensitive action (ban, delete, deactivate, role change) must:
  1. Show a confirmation modal with a clear description of the action.
  2. Require the admin to confirm before proceeding.
  3. Display a success or failure toast after completion.
- The backend records audit logs; the frontend must not attempt to write them directly.

## 9. Performance Rules

- Lazy-load route components using React Router's code-splitting.
- Paginate all tables — default page size 20, configurable up to 100.
- Debounce all search/filter inputs.
- Avoid re-fetching data on every render; cache responses in component state between interactions.

## 10. Testing

- Unit test all functions in `app/functions/`.
- Integration test key flows: login, OTP verification, user ban, content deletion.
- Use Jest + React Testing Library.
- Maintain 80%+ coverage on `app/functions/` and `app/api/`.

## 11. Code Review Checklist

- [ ] No `any` types introduced.
- [ ] All API calls go through `app/api/` modules.
- [ ] Destructive actions have confirmation modals.
- [ ] Loading, empty, and error states handled.
- [ ] User-generated content sanitized before rendering.
- [ ] Forms validate inputs and disable submit during loading.
- [ ] New routes added to `app/routes.ts` and sidebar nav.
- [ ] TypeScript check passes (`npm run typecheck`).
- [ ] No hardcoded secrets or API keys in source code.
- [ ] README updated if new env vars or modules are added.

## 12. Environment Variables

All env vars are accessed via `app/functions/environmentVariables.ts`. Never read `import.meta.env.*` directly in components or API modules.

Required variables:
- `VITE_API_URL` — backend API base URL.
- `VITE_ADMIN_API_KEY` — must match backend `ADMIN_API_KEY`.
- `VITE_ADMIN_SESSION_NAME`, `VITE_ADMIN_SESSION_KEY` — session storage keys.
- `VITE_ADMIN_TOKEN_NAME`, `VITE_ADMIN_TOKEN_KEY` — token storage keys.

## 13. Do Not

- Do not bypass the Axios instance for API calls.
- Do not store tokens or session data unencrypted.
- Do not render user-generated content without sanitizing it first.
- Do not perform destructive actions without a confirmation modal.
- Do not add new npm dependencies without checking existing ones first.
- Do not commit `.env` files containing real secrets.
- Do not give non-Super Admin roles access to admin account management routes.
