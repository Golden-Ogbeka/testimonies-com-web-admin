import type React from 'react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { RoutePaths } from '../../routes/route-paths';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signOut } from '../../store/slices/admin';
import { AdminAuthApi } from '../../api/adminAuth';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { mainLinks, secondaryLinks } from '../navLinks';

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

  const renderNavLinks = (iconsOnly: boolean, isMobile: boolean = false) => {
    return (
      <div className="mt-4 flex-1 space-y-1 px-3">
        <nav aria-label="Dashboard navigation" className="flex flex-col gap-1">
          {mainLinks.map((item) => {
            const isActive =
              location.pathname === item.href ||
              location.pathname.startsWith(`${item.href}/`);
            const linkClasses = `flex items-center rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'sidebar-item-active'
                : 'text-slate-600 hover:bg-slate-50'
            } ${iconsOnly ? 'justify-center p-3' : 'gap-3 px-4 py-3'}`;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={isMobile ? onMobileClose : undefined}
                className={linkClasses}
                title={iconsOnly ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" aria-hidden />
                {!iconsOnly && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Administration section - always show icons when collapsed */}
        <div className="mt-6">
          {!iconsOnly && (
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mx-2 mb-3">
              Administration
            </p>
          )}
          <nav className="flex flex-col gap-1">
            {secondaryLinks.map((item) => {
              const isActive =
                location.pathname === item.href ||
                location.pathname.startsWith(`${item.href}/`);
              const linkClasses = `flex items-center rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'sidebar-item-active'
                  : 'text-slate-600 hover:bg-slate-50'
              } ${iconsOnly ? 'justify-center p-3' : 'gap-3 px-4 py-3'}`;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={isMobile ? onMobileClose : undefined}
                  className={linkClasses}
                  title={iconsOnly ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" aria-hidden />
                  {!iconsOnly && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
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

      {/* Desktop sidebar */}
      <nav
        className={`hidden lg:flex flex-col max-h-screen bg-white border-r border-slate-200 transition-[width] duration-300 ${
          collapsed ? 'w-16' : 'w-64'
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

        <div className="px-4 pt-4 pb-6">
          <Link to={RoutePaths.DASHBOARD}>
            <div
              className={`flex items-center gap-2 ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-semibold">
                T
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">
                    Testimonies Admin
                  </span>
                  <span className="text-xs text-slate-500">
                    {admin?.role === 'super-admin' ? 'Super Admin' : 'Admin'}
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

      {/* Mobile drawer */}
      {onMobileClose && (
        <nav
          className={`fixed left-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 ease-out lg:hidden ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
            <Link
              to={RoutePaths.DASHBOARD}
              onClick={onMobileClose}
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-semibold">
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

          {renderNavLinks(false, true)}

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

      {/* Logout Confirmation Dialog */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Log out?
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setLogoutConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
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
