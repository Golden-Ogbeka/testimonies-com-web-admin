import type React from "react";
import { Link, useNavigate } from "react-router";
import { RoutePaths } from "../../routes/route-paths";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { signOut } from "../../store/slices/admin";
import { LogoutIcon } from "../navIcons";
import { mainLinks, secondaryLinks } from "../navLinks";
import SidebarLink from "../SidebarLink";
import styles from "../styles.module.css";

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
  const dispatch = useAppDispatch();
  const admin = useAppSelector((state) => state.admin.profile);

  const handleLogout = () => {
    dispatch(signOut());
    navigate(RoutePaths.LOGIN);
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
            isMobileOpen ? "block" : "hidden"
          }`}
        />
      )}

      {/* Desktop sidebar */}
      <nav
        className={`hidden lg:flex flex-col max-h-screen bg-white border-r border-gray-100 transition-[width] duration-300 ${
          collapsed ? "w-16" : "w-[260px]"
        }`}
      >
        <div className="flex h-16 items-center justify-center border-b border-gray-100 px-4">
          {onCollapsedChange && (
            <button
              type="button"
              onClick={() => onCollapsedChange(!collapsed)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <span className="block h-0.5 w-4 rounded bg-gray-500" />
            </button>
          )}
        </div>

        <div className="px-4 pt-4 pb-6">
          <Link to={RoutePaths.DASHBOARD}>
            <div
              className={`flex items-center gap-2 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-500 text-white font-semibold">
                T
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">
                    Testimonies Admin
                  </span>
                  <span className="text-xs text-gray-500">
                    {admin?.role === "super-admin" ? "Super Admin" : "Admin"}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>

        <ul className="flex flex-col px-4 gap-8 pb-4 overflow-y-auto customized-scrollbar">
          <div>
            {!collapsed && (
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mx-2 mb-3">
                Main
              </p>
            )}
            <div className="flex flex-col gap-1.5">
              {mainLinks.map((item) => (
                <SidebarLink key={item.href} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>

          <div>
            {!collapsed && (
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mx-2 mb-3">
                Administration
              </p>
            )}
            <div className="flex flex-col gap-1.5">
              {secondaryLinks.map((item) => (
                <SidebarLink key={item.href} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        </ul>

        <div className="mt-auto border-t border-gray-100 px-3 py-3">
          <button
            type="button"
            className={`${styles.navLink} text-red-500 w-full justify-start ${
              collapsed ? "justify-center" : ""
            }`}
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
          >
            <LogoutIcon />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {onMobileClose && (
        <nav
          className={`fixed left-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-r border-gray-100 bg-white shadow-xl transition-transform duration-200 ease-out lg:hidden ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
            <Link
              to={RoutePaths.DASHBOARD}
              onClick={onMobileClose}
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-500 text-white font-semibold">
                T
              </div>
              <span className="text-sm font-semibold text-gray-900">
                Testimonies Admin
              </span>
            </Link>
            <button
              type="button"
              onClick={onMobileClose}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <span className="block h-0.5 w-4 rounded bg-gray-500" />
            </button>
          </div>

          <ul className="flex flex-col px-4 gap-8 pb-4 overflow-y-auto customized-scrollbar">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mx-2 mb-3">
                Main
              </p>
              <div className="flex flex-col gap-1.5">
                {mainLinks.map((item) => (
                  <SidebarLink key={item.href} item={item} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mx-2 mb-3">
                Administration
              </p>
              <div className="flex flex-col gap-1.5">
                {secondaryLinks.map((item) => (
                  <SidebarLink key={item.href} item={item} />
                ))}
              </div>
            </div>
          </ul>

          <div className="mt-auto border-t border-gray-100 px-3 py-3">
            <button
              type="button"
              className={`${styles.navLink} text-red-500 w-full justify-start`}
              onClick={handleLogout}
            >
              <LogoutIcon />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      )}
    </>
  );
};

export default Sidebar;

