import {
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AdminAuthApi } from '../../api/adminAuth';
import { RoutePaths } from '../../routes/route-paths';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signOut } from '../../store/slices/admin';
import {
  getActiveGroupLabels,
  isNavGroupItem,
  isNavItemActive,
  navigationSections,
  type NavGroupItem,
  type NavLinkItem,
  type NavSection,
} from '../navLinks';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen = false,
  onMobileClose,
  collapsed = false,
  onCollapsedChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const admin = useAppSelector((state) => state.admin.profile);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const [openFlyoutGroup, setOpenFlyoutGroup] = useState<string | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const activeGroups = getActiveGroupLabels(location.pathname);
    if (activeGroups.length === 0) return;

    setExpandedGroups((previous) => {
      const nextState = { ...previous };
      activeGroups.forEach((label) => {
        nextState[label] = true;
      });
      return nextState;
    });
  }, [location.pathname]);

  useEffect(() => {
    setOpenFlyoutGroup(null);
  }, [location.pathname, collapsed]);

  useEffect(() => {
    if (!openFlyoutGroup) return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node)
      ) {
        setOpenFlyoutGroup(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openFlyoutGroup]);

  const handleLogout = async () => {
    try {
      await AdminAuthApi.logout();
    } catch {
      // Best-effort: even if the API fails, clear local session.
    } finally {
      dispatch(signOut());
      navigate(RoutePaths.LOGIN);
    }
  };

  const toggleGroup = (group: NavGroupItem, iconsOnly: boolean) => {
    if (iconsOnly) {
      setOpenFlyoutGroup((current) =>
        current === group.label ? null : group.label,
      );
      return;
    }

    setExpandedGroups((previous) => ({
      ...previous,
      [group.label]: !previous[group.label],
    }));
  };

  const handleNavLinkClick = () => {
    setOpenFlyoutGroup(null);
    onMobileClose?.();
  };

  const renderLeafLink = (
    item: NavLinkItem,
    options: {
      iconsOnly: boolean;
      isChild?: boolean;
    },
  ) => {
    const isActive = isNavItemActive(item, location.pathname);
    const linkClasses = `flex items-center rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'sidebar-item-active' : 'text-slate-600 hover:bg-slate-50'
    } ${
      options.iconsOnly
        ? 'justify-center p-3'
        : options.isChild
          ? 'gap-3 px-4 py-2.5 pl-12'
          : 'gap-3 px-4 py-3'
    }`;

    return (
      <Link
        key={item.href}
        to={item.href}
        onClick={handleNavLinkClick}
        className={linkClasses}
        title={options.iconsOnly ? item.label : undefined}
      >
        {item.icon ? (
          <item.icon className="h-5 w-5 shrink-0" aria-hidden />
        ) : (
          <span
            aria-hidden
            className="h-2 w-2 shrink-0 rounded-full bg-current opacity-60"
          />
        )}
        {!options.iconsOnly && <span>{item.label}</span>}
      </Link>
    );
  };

  const renderCollapsedFlyout = (group: NavGroupItem) => {
    if (openFlyoutGroup !== group.label) return null;

    return (
      <div className="absolute left-full top-0 z-20 ml-3 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {group.label}
        </p>
        <div className="space-y-1">
          {group.children.map((child) =>
            renderLeafLink(child, { iconsOnly: false, isChild: false }),
          )}
        </div>
      </div>
    );
  };

  const renderGroup = (
    group: NavGroupItem,
    options: {
      iconsOnly: boolean;
    },
  ) => {
    const isActive = isNavItemActive(group, location.pathname);
    const isOpen = options.iconsOnly
      ? openFlyoutGroup === group.label
      : Boolean(expandedGroups[group.label]);

    return (
      <div key={group.label} className="relative">
        <button
          type="button"
          onClick={() => toggleGroup(group, options.iconsOnly)}
          className={`flex w-full items-center rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? 'sidebar-item-active'
              : 'text-slate-600 hover:bg-slate-50'
          } ${options.iconsOnly ? 'justify-center p-3' : 'gap-3 px-4 py-3'}`}
          aria-expanded={isOpen}
          aria-controls={`nav-group-${group.label}`}
          title={options.iconsOnly ? group.label : undefined}
        >
          <group.icon className="h-5 w-5 shrink-0" aria-hidden />
          {!options.iconsOnly && (
            <>
              <span className="flex-1 text-left">{group.label}</span>
              <ChevronDownIcon
                className={`h-4 w-4 shrink-0 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
                aria-hidden
              />
            </>
          )}
        </button>

        {options.iconsOnly ? (
          renderCollapsedFlyout(group)
        ) : (
          <div
            id={`nav-group-${group.label}`}
            className={`overflow-hidden transition-[max-height,opacity] duration-200 ${
              isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="mt-1 space-y-1">
              {group.children.map((child) =>
                renderLeafLink(child, { iconsOnly: false, isChild: true }),
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSection = (
    section: NavSection,
    options: {
      iconsOnly: boolean;
    },
  ) => (
    <div
      key={section.label ?? 'main'}
      className={section.label ? 'mt-6' : undefined}
    >
      {section.label && !options.iconsOnly && (
        <p className="mx-2 mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
          {section.label}
        </p>
      )}
      <nav
        aria-label={section.label ?? 'Dashboard navigation'}
        className="flex flex-col gap-1"
      >
        {section.items.map((item) =>
          isNavGroupItem(item)
            ? renderGroup(item, options)
            : renderLeafLink(item, options),
        )}
      </nav>
    </div>
  );

  const renderNavLinks = (iconsOnly: boolean) => (
    <div ref={navContainerRef} className="mt-4 flex-1 px-3 pb-4">
      {navigationSections.map((section) =>
        renderSection(section, { iconsOnly }),
      )}
    </div>
  );

  return (
    <>
      {onMobileClose && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onMobileClose}
          className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden ${
            isMobileOpen ? 'block' : 'hidden'
          }`}
        />
      )}

      <nav
        className={`hidden max-h-screen flex-col border-r border-slate-200 bg-white transition-[width] duration-300 lg:flex ${
          collapsed ? 'w-16' : 'w-72'
        }`}
      >
        <div className="flex h-16 flex-col items-center justify-center border-b border-slate-200 bg-white px-0">
          {onCollapsedChange && (
            <button
              type="button"
              onClick={() => onCollapsedChange(!collapsed)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRightIcon className="h-5 w-5" aria-hidden />
              ) : (
                <ChevronLeftIcon className="h-5 w-5" aria-hidden />
              )}
            </button>
          )}
        </div>

        <div className="px-4 pb-6 pt-4">
          <Link to={RoutePaths.DASHBOARD}>
            <div
              className={`flex items-center gap-2 ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-semibold text-white">
                T
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">
                    Testimonies Admin
                  </span>
                  <span className="text-xs text-slate-500">
                    {admin?.firstName || ''} {admin?.lastName || ''}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>

        {renderNavLinks(collapsed)}

        <div className="mt-auto border-t border-slate-200 px-3 py-2">
          <button
            type="button"
            onClick={() => setLogoutConfirmOpen(true)}
            className={`flex w-full items-center rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 ${
              collapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
            }`}
            title={collapsed ? 'Logout' : undefined}
          >
            <ArrowRightOnRectangleIcon
              className="h-5 w-5 shrink-0"
              aria-hidden
            />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </nav>

      {onMobileClose && (
        <nav
          className={`fixed left-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 ease-out lg:hidden ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
            <Link
              to={RoutePaths.DASHBOARD}
              onClick={handleNavLinkClick}
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-semibold text-white">
                T
              </div>
              <span className="text-sm font-semibold text-slate-900">
                Testimonies Admin
              </span>
            </Link>
            <button
              type="button"
              onClick={onMobileClose}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden />
            </button>
          </div>

          {renderNavLinks(false)}

          <div className="mt-auto border-t border-slate-200 px-3 py-2">
            <button
              type="button"
              onClick={() => {
                setLogoutConfirmOpen(true);
                onMobileClose();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <ArrowRightOnRectangleIcon
                className="h-5 w-5 shrink-0"
                aria-hidden
              />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      )}

      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-sm rounded-lg bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Log out?
            </h3>
            <p className="mb-6 text-sm text-slate-600">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setLogoutConfirmOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
