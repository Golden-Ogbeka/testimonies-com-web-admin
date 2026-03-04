import type React from "react";
import { RoutePaths } from "../routes/route-paths";
import {
  AuditLogIcon,
  ContentIcon,
  DashboardIcon,
  PromotionsIcon,
  RolesIcon,
  SettingsIcon,
  SubscriptionsIcon,
  TestimoniesIcon,
  UsersIcon,
} from "./navIcons";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const mainLinks: NavItem[] = [
  {
    label: "Dashboard",
    href: RoutePaths.DASHBOARD,
    icon: <DashboardIcon />,
  },
  {
    label: "Users",
    href: RoutePaths.USERS,
    icon: <UsersIcon />,
  },
  {
    label: "Testimonies",
    href: RoutePaths.TESTIMONIES,
    icon: <TestimoniesIcon />,
  },
  {
    label: "Subscriptions",
    href: RoutePaths.SUBSCRIPTION_PLANS,
    icon: <SubscriptionsIcon />,
  },
  {
    label: "Promotions",
    href: RoutePaths.PROMOTIONS,
    icon: <PromotionsIcon />,
  },
];

export const secondaryLinks: NavItem[] = [
  {
    label: "Roles & Permissions",
    href: RoutePaths.PERMISSIONS,
    icon: <RolesIcon />,
  },
  {
    label: "Content",
    href: RoutePaths.FAQS,
    icon: <ContentIcon />,
  },
  {
    label: "Audit Logs",
    href: RoutePaths.AUDIT_LOGS,
    icon: <AuditLogIcon />,
  },
  {
    label: "Settings",
    href: RoutePaths.PROFILE_SETTINGS,
    icon: <SettingsIcon />,
  },
];

