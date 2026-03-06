import { useState } from 'react';
import { Outlet } from 'react-router';
import FullPageLoader from '../../common/full-page-loader';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuthGuard } from '../../hooks/useAuthGuard';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const { loading } = useAuthGuard('dashboard');

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <div className="max-h-screen h-full flex bg-background-light">
      <div className="flex flex-row flex-nowrap w-full">
        <Sidebar
          isMobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
        <main className="w-full overflow-auto bg-background-light">
          <Navbar
            onMenuClick={() => setSidebarOpen(true)}
            ariaExpanded={sidebarOpen}
          />
          <div className="px-3 py-4 sm:px-5 sm:py-5 lg:px-6 min-h-[calc(100vh-4rem)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
