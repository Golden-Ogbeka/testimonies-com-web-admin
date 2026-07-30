# Testimonies Admin Dashboard

A modern, production-ready admin dashboard for managing the Testimonies platform. Built with React Router 7, TypeScript, TailwindCSS, and Redux Toolkit.

## 📋 Documentation

- **[Product Requirements Document (PRD)](./PRD.md)** — Full feature specifications for the admin dashboard
- **[Agent Guidelines](./AGENTS.md)** — Development rules and coding standards for AI agents

## Features

- 🚀 Server-side rendering with React Router 7
- ⚡️ Hot Module Replacement (HMR)
- 🔒 TypeScript for type safety
- 🎨 TailwindCSS for styling
- 📊 Redux Toolkit for state management
- 🔐 Secure admin authentication with OTP
- 📱 Responsive design for mobile and desktop

## Admin Features

### User Management

- View and manage all platform users
- Activate/deactivate user accounts
- View detailed user profiles
- Filter users by account type and subscription

### Testimony Management

- Browse all testimonies
- Flag/unflag inappropriate content
- View flagged testimonies
- Analytics dashboard with engagement metrics

### Subscription Management

- Create and manage subscription plans
- View active and cancelled subscriptions
- Track unsubscribed users
- Configure pricing and billing cycles

### Promotions

- Create promotional campaigns
- Target specific user segments
- Manage active/inactive promotions
- Review flagged promotions

### Content Management

- Manage FAQs
- Update privacy policy
- Update terms of service
- Update community guidelines
- Define team permissions

### Roles & Permissions

- Manage admin accounts
- Assign roles (Admin/Super Admin)
- Control access permissions

### Audit Logs

- Track all administrative actions
- Filter by category, level, and date
- View detailed log entries
- Monitor admin activity

### Profile Settings

- Update personal information
- Change password
- View account status

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Access to the Testimonies backend API

### Installation

Install the dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Configure the following environment variables:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1

# Admin API Key (must match backend ADMIN_API_KEY)
VITE_ADMIN_API_KEY=your_admin_api_key_here

# Session and Token Configuration (optional - defaults provided)
VITE_ADMIN_SESSION_NAME=testimonies_admin_session
VITE_ADMIN_SESSION_KEY=testimonies_admin_session_key
VITE_ADMIN_TOKEN_NAME=testimonies_admin_token
VITE_ADMIN_TOKEN_KEY=testimonies_admin_token_key
```

**Important:** The `VITE_ADMIN_API_KEY` must match the `ADMIN_API_KEY` configured in your backend `.env` file.

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
```

## Building for Production

Create a production build:

```bash
npm run build
```

## Project Structure

```
app/
├── api/                    # API client modules
│   ├── adminAuth.ts
│   ├── adminUsers.ts
│   ├── adminTestimonies.ts
│   ├── adminSubscriptions.ts
│   ├── adminPromotions.ts
│   ├── adminContent.ts
│   ├── adminAuditLogs.ts
│   ├── adminRolesPermissions.ts
│   └── axios.ts
├── common/                 # Shared components
│   ├── FilterBar.tsx
│   ├── Modal.tsx
│   ├── PageHeader.tsx
│   └── Table.tsx
├── functions/              # Utility functions
│   ├── encryption.ts
│   ├── environmentVariables.ts
│   ├── feedback.ts
│   ├── security.ts
│   └── userSession.ts
├── layout/                 # Layout components
│   ├── auth-layout/
│   ├── dashboard-layout/
│   ├── navIcons.tsx
│   ├── navLinks.tsx
│   └── SidebarLink.tsx
├── routes/                 # Route components
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
│   ├── enums.ts
│   └── index.ts
├── app.css
├── root.tsx
└── routes.ts
```

## Design System

The application uses a consistent design system defined in `app.css`:

### Color Palette

- **Primary Blue**: `#1d4ed8` - Main brand color for buttons and links
- **Emerald Green**: `#10b981` - Success states and positive actions
- **Red**: `#dc2626` - Danger states and destructive actions
- **Gray Scale**: Various shades for text, borders, and backgrounds

### Utility Classes

**Form Inputs**

```css
.inputContainer - Styled form input wrapper with label and input
```

**Buttons**

```css
.btn-primary - Primary action button (blue)
.btn-secondary - Secondary action button (gray)
.btn-danger - Destructive action button (red)
```

**Cards**

```css
.card - Content card with border, shadow, and padding
```

**Badges**

```css
.badge - Base badge style
.badge-success - Green badge for success states
.badge-warning - Yellow badge for warning states
.badge-danger - Red badge for error states
.badge-info - Blue badge for info states
.badge-gray - Gray badge for neutral states
```

### Layout Consistency

- All dashboard pages use `dashboard-layout` with sidebar navigation
- All auth pages use `auth-layout` with centered forms
- Consistent spacing and typography throughout
- Responsive design for mobile and desktop

## API Integration

The admin dashboard integrates with the Testimonies backend API. All API endpoints are prefixed with `/admin` and require authentication.

### Authentication Flow

1. Admin logs in with email and password
2. Backend sends OTP to email
3. Admin verifies OTP
4. JWT token is stored and used for subsequent requests

### API Modules

- `adminAuth.ts` - Authentication and profile management
- `adminUsers.ts` - User management
- `adminTestimonies.ts` - Testimony management and analytics
- `adminSubscriptions.ts` - Subscription plan management
- `adminPromotions.ts` - Promotion campaigns
- `adminContent.ts` - Content management (FAQs, policies, etc.)
- `adminAuditLogs.ts` - Audit log viewing
- `adminRolesPermissions.ts` - Admin account and permission management

## Deployment

### Production Checklist

Before deploying to production, ensure:

- [ ] Environment variables are properly configured in `.env`
- [ ] `VITE_API_URL` points to production backend API
- [ ] `VITE_ADMIN_API_KEY` matches backend configuration
- [ ] All TypeScript checks pass (`npm run typecheck`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Backend API is accessible from the deployment environment
- [ ] CORS is configured on backend to allow admin dashboard domain
- [ ] SSL/TLS certificates are configured for HTTPS
- [ ] Error monitoring is set up (e.g., Sentry)
- [ ] Analytics tracking is configured (if needed)

### Docker Deployment

To build and run using Docker:

```bash
docker build -t testimonies-admin .

# Run the container
docker run -p 3000:3000 testimonies-admin
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`:

```
├── package.json
├── package-lock.json
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Tech Stack

- **React Router 7** - Full-stack React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Vite** - Build tool
- **crypto-js** - Encryption library

## Security Features

The admin dashboard implements comprehensive security measures:

### Authentication & Authorization

- JWT token-based authentication
- OTP verification for login
- Encrypted token storage using crypto-js
- Automatic logout on 401/403 responses
- Session expiry checking

### API Security

- Admin API key validation on all requests
- Request ID tracking (x-request-id header)
- Axios interceptors for automatic auth headers
- Environment-based configuration

### Input Validation & Sanitization

- XSS prevention with HTML sanitization
- Email format validation
- Strong password requirements (8+ chars, uppercase, lowercase, number, special char)
- MongoDB ObjectId validation
- Phone number validation
- Real-time password strength feedback

### Client-Side Protection

- Rate limiting for sensitive operations
- HTML entity encoding
- No sensitive data in URLs
- Secure token generation
- Password reuse prevention

### Security Utilities

All security functions are available in `app/functions/security.ts`:

- `sanitizeHtml()` - XSS prevention
- `isValidEmail()` - Email validation
- `isStrongPassword()` - Password strength validation
- `isValidObjectId()` - MongoDB ID validation
- `escapeHtml()` - HTML encoding
- `isSessionExpired()` - Session checking
- `generateSecureToken()` - Token generation
- `isValidPhoneNumber()` - Phone validation
- `checkRateLimit()` - Rate limiting
- `clearRateLimit()` - Rate limit cleanup

## Contributing

This is an internal admin dashboard. For questions or issues, contact the development team.

## License

This project is licensed under the [MIT License](LICENSE).

---
