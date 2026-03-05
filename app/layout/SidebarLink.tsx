import type React from 'react';
import { Link, useLocation } from 'react-router';
import type { NavItem } from './navLinks';
import styles from './styles.module.css';

interface SidebarLinkProps {
  item: NavItem;
  collapsed?: boolean;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({
  item,
  collapsed = false,
}) => {
  const location = useLocation();
  const Icon = item.icon;

  const isActive =
    location.pathname === item.href ||
    location.pathname.startsWith(`${item.href}/`);

  return (
    <Link to={item.href}>
      <li className={isActive ? styles.activeNavLink : styles.navLink}>
        <Icon className={styles.navIcon} />
        {!collapsed && <span>{item.label}</span>}
      </li>
    </Link>
  );
};

export default SidebarLink;
