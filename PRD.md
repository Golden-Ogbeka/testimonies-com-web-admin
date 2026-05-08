# Testimonies.com Admin Dashboard — Product Requirements Document (PRD)

## 1. Product Overview

### 1.1 Vision

The Testimonies.com Admin Dashboard is the internal control centre for the platform. It gives authorised administrators full visibility and control over users, content, subscriptions, promotions, and platform configuration.

### 1.2 Mission

- Enable admins to monitor and moderate all platform activity.
- Provide tools to manage users, testimonies, subscriptions, and promotions.
- Maintain platform integrity through audit logging and role-based access control.
- Allow configuration of platform content (FAQs, policies, guidelines).

### 1.3 Target Users

- **Super Admins**: Full access to all features including admin account management.
- **Admins**: Access to moderation, user management, content, and analytics.

---

## 2. Authentication

### 2.1 Login Flow

1. Admin enters email and password.
2. Backend sends OTP to registered email.
3. Admin verifies OTP.
4. JWT token is issued and stored securely (encrypted via crypto-js).

### 2.2 Session Management

- Automatic logout on 401/403 responses.
- Session expiry checking on each page load.
- Encrypted token storage — never plain localStorage.

### 2.3 Password Management

- Change password from profile settings.
- Strong password requirements: 8+ chars, uppercase, lowercase, number, special character.
- Password reuse prevention.

---

## 3. Dashboard Home

- Summary cards: total users, active subscriptions, testimonies posted today, flagged content count, pending broadcast approvals, active promotions.
- Recent activity feed: latest registrations, flagged content, new subscriptions.
- Quick-action links to most-used sections.
- Platform health indicators (API status, job queue status).

---

## 4. User Management

### 4.1 User List

- Paginated table of all platform users.
- Columns: username, display name, account type (personal/organisation), subscription status, verification status, registration date, account status (active/suspended/banned).
- Filter by: account type, subscription status, verification status, account status.
- Search by username, email, display name.

### 4.2 User Detail View

- Full profile information.
- Subscription history.
- Testimony count and list.
- Reported content associated with the user.
- Account activity log.
- Team memberships (for organisation accounts).

### 4.3 User Actions

- Activate / deactivate account.
- Suspend account (temporary, with reason and duration).
- Ban account (permanent, with reason).
- Lift suspension or ban.
- Send warning notification to user.
- View and manage user's reported content.

---

## 5. Testimony Management

### 5.1 Testimony List

- Paginated table of all testimonies.
- Columns: author, content preview, format (text/audio/video/image), post date, like count, reply count, flagged status, visibility (public/private).
- Filter by: content format, flagged status, date range, account type.
- Search by content text or author username.

### 5.2 Flagged Testimonies

- Dedicated view for all flagged/reported testimonies.
- Shows report reason, reporter username, and report date.
- Actions: dismiss flag, remove content, warn author, suspend author.

### 5.3 Testimony Actions

- View full testimony content.
- Flag / unflag testimony.
- Delete testimony.
- View all replies on a testimony.

### 5.4 Analytics Overview

- Total testimonies posted (daily/weekly/monthly charts).
- Breakdown by content format.
- Engagement metrics: total likes, replies, shares.
- Top performing testimonies.

---

## 6. Subscription Management

### 6.1 Subscription Plans

- List all subscription plans (name, price, billing cycle, features, status).
- Create new subscription plan.
- Edit existing plan (name, price, features, active/inactive).
- Deactivate a plan (existing subscribers unaffected until renewal).

### 6.2 Active Subscriptions

- Paginated list of all active subscriptions.
- Columns: user, plan, start date, renewal date, payment gateway, amount paid.
- Filter by plan, gateway, date range.
- Search by username or email.

### 6.3 Cancelled Subscriptions

- List of cancelled subscriptions with cancellation date and reason.

### 6.4 Unsubscribed Users

- List of users who have never subscribed or whose subscription has lapsed.
- Quick action to send subscription reminder.

### 6.5 Subscription Actions

- View full subscription details.
- Manually activate or cancel a subscription (with reason).
- Issue refund (triggers payment gateway refund flow).

---

## 7. Promotions Management

### 7.1 Promotion List

- Paginated table of all promotion campaigns across all users.
- Columns: campaign name, type (general/promoted post), owner, status (active/inactive/flagged), start date, budget, impressions.
- Filter by type, status, date range.
- Search by campaign name or owner username.

### 7.2 Flagged Promotions

- Dedicated view for reported or auto-flagged promotions.
- Actions: approve, reject, remove, warn advertiser.

### 7.3 Promotion Actions

- View full campaign details.
- Activate / deactivate campaign.
- Delete campaign.
- Flag campaign for review.

---

## 8. Content Management

### 8.1 FAQs

- List all FAQ entries (question, answer, category, display order).
- Create new FAQ.
- Edit existing FAQ.
- Delete FAQ.
- Reorder FAQs via drag-and-drop or order field.

### 8.2 Privacy Policy

- View current privacy policy content.
- Edit and publish updated privacy policy.
- Version history of policy changes.

### 8.3 Terms of Service

- View current terms of service.
- Edit and publish updated terms.
- Version history.

### 8.4 Community Guidelines

- View current community guidelines.
- Edit and publish updated guidelines.
- Version history.

### 8.5 Team Permissions

- Define the set of available permissions that can be assigned to organisation team members.
- Create, edit, and delete permission definitions.

---

## 9. Roles & Permissions (Admin Accounts)

### 9.1 Admin Account List

- List all admin accounts.
- Columns: name, email, role (Admin / Super Admin), status (active/inactive), last login.
- Filter by role and status.

### 9.2 Admin Account Actions

- Create new admin account (Super Admin only).
- Edit admin details and role.
- Activate / deactivate admin account.
- Reset admin password (sends reset email).

### 9.3 Role Definitions

- **Super Admin**: Full access including admin account management and platform configuration.
- **Admin**: Access to user management, content moderation, subscriptions, promotions, and audit logs. Cannot manage other admin accounts.

---

## 10. Audit Logs

### 10.1 Log List

- Paginated, filterable list of all administrative actions.
- Columns: timestamp, admin username, action category, action description, severity level, affected resource.
- Filter by: category (user management, content, subscription, promotion, settings), severity level (info, warning, critical), date range, admin username.
- Search by action description or affected resource ID.

### 10.2 Log Detail

- Full detail view of a single audit log entry.
- Shows before/after state for data changes where applicable.

### 10.3 Log Retention

- Logs are read-only — no editing or deletion from the dashboard.
- Retention policy configured at the backend level.

---

## 11. Profile & Settings

### 11.1 Admin Profile

- View and update personal information (name, email).
- Change password.
- View account role and status.
- View own recent activity in audit log.

---

## 12. Notifications & Alerts

- In-dashboard notification bell for: new flagged content, new user reports, pending KYC verifications, failed payment webhooks.
- Configurable alert thresholds (e.g., alert when flagged content count exceeds N).

---

## 13. Non-Functional Requirements

### 13.1 Tech Stack

- **Framework**: React Router 7 (full-stack, SSR)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios with interceptors
- **Build Tool**: Vite
- **Encryption**: crypto-js for token storage

### 13.2 Security

- All routes require valid admin JWT.
- Admin API key (`x-api-key`) sent on every request.
- Encrypted token storage — never plain text.
- Automatic logout on session expiry or 401/403.
- XSS prevention: sanitize all rendered user-generated content.
- Input validation on all forms before submission.
- Rate limiting on sensitive operations (login, OTP).

### 13.3 Performance

- Table pagination — never load unbounded lists.
- Debounced search inputs.
- Lazy-load route components.

### 13.4 Accessibility

- Keyboard navigable tables and forms.
- ARIA labels on all interactive elements.
- Sufficient colour contrast.

### 13.5 Responsiveness

- Fully functional on desktop (primary) and tablet.
- Mobile layout supported but not the primary target.

---

## 14. Design System

### 14.1 Colour Palette

- **Primary Blue** `#1d4ed8`: main actions, links.
- **Emerald Green** `#10b981`: success states, active badges.
- **Red** `#dc2626`: danger actions, error states.
- **Gray scale**: text, borders, backgrounds.

### 14.2 Component Classes

- `.btn-primary`, `.btn-secondary`, `.btn-danger` — action buttons.
- `.card` — content containers.
- `.badge`, `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-info`, `.badge-gray` — status indicators.
- `.inputContainer` — form input wrapper with label.

### 14.3 Layout

- All dashboard pages use `dashboard-layout` with sidebar navigation.
- All auth pages use `auth-layout` with centred forms.
