import type React from 'react';
import styles from './styles.module.css';

interface IconProps {
  className?: string;
}

const baseIconClass = styles.navIcon;

const mergeClassName = (className?: string): string =>
  [baseIconClass, className].filter(Boolean).join(' ');

export const DashboardIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={mergeClassName(className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="3"
      width="8"
      height="8"
      rx="2"
      stroke="#6B7280"
      strokeWidth="1.5"
    />
    <rect
      x="13"
      y="3"
      width="8"
      height="5"
      rx="2"
      stroke="#6B7280"
      strokeWidth="1.5"
    />
    <rect
      x="13"
      y="10"
      width="8"
      height="11"
      rx="2"
      stroke="#6B7280"
      strokeWidth="1.5"
    />
    <rect
      x="3"
      y="13"
      width="8"
      height="8"
      rx="2"
      stroke="#6B7280"
      strokeWidth="1.5"
    />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={mergeClassName(className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="9" cy="8" r="3" stroke="#6B7280" strokeWidth="1.5" />
    <path
      d="M4 18C4.8 15.5 6.66667 14 9 14C11.3333 14 13.2 15.5 14 18"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="17" cy="9" r="2.5" stroke="#6B7280" strokeWidth="1.5" />
    <path
      d="M15.5 15C17.3 15.2 18.5 16.1 19 18"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const TestimoniesIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={mergeClassName(className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="14"
      rx="3"
      stroke="#6B7280"
      strokeWidth="1.5"
    />
    <path
      d="M8 18L6.5 20.5"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9 9H15"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9 13H13"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const SubscriptionsIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={mergeClassName(className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="3"
      stroke="#6B7280"
      strokeWidth="1.5"
    />
    <path
      d="M9 9H15"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9 13H13"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9 17H11"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const PromotionsIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={mergeClassName(className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 4H14L18 8V20H6V4Z"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 12.5C11.1046 12.5 12 11.6046 12 10.5C12 9.39543 11.1046 8.5 10 8.5C8.89543 8.5 8 9.39543 8 10.5C8 11.6046 8.89543 12.5 10 12.5Z"
      stroke="#6B7280"
      strokeWidth="1.5"
    />
    <path
      d="M13.5 15.5L11.5 13.5"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const RolesIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={mergeClassName(className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8" cy="8" r="3" stroke="#6B7280" strokeWidth="1.5" />
    <circle cx="17" cy="9" r="2.5" stroke="#6B7280" strokeWidth="1.5" />
    <path
      d="M4 19C4.7 16.5 6.4 15.2 8.9 15.2C10.8 15.2 12.3 16 13.2 17.5"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14.5 19.5C15 18 16.1 17.2 17.6 17.2"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const ContentIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={mergeClassName(className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="2"
      stroke="#6B7280"
      strokeWidth="1.5"
    />
    <path
      d="M8 9H16"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 13H14"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 17H12"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const AuditLogIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={mergeClassName(className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="7" stroke="#6B7280" strokeWidth="1.5" />
    <path
      d="M12 9V12.5L14.5 14"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={mergeClassName(className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="3" stroke="#6B7280" strokeWidth="1.5" />
    <path
      d="M6.5 4.5L7.5 6.5M17.5 4.5L16.5 6.5M4.5 9L6.5 10M19.5 9L17.5 10M4.5 15L6.5 14M19.5 15L17.5 14M6.5 19.5L7.5 17.5M17.5 19.5L16.5 17.5"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={mergeClassName(className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 5H6.5C5.39543 5 4.5 5.89543 4.5 7V17C4.5 18.1046 5.39543 19 6.5 19H10"
      stroke="#EF4444"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14 8L17 11M17 11L14 14M17 11H9"
      stroke="#EF4444"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
