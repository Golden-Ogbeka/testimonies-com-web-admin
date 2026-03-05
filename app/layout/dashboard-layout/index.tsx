import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import FullPageLoader from '../../common/full-page-loader';
import { sendFeedback } from '../../functions/feedback';
import { getSessionDetails } from '../../functions/userSession';
import { RoutePaths } from '../../routes/route-paths';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  useEffect(() => {
    const currentAdmin = getSessionDetails();

    if (!currentAdmin) {
      sendFeedback('Login to continue');
      navigate(RoutePaths.LOGIN);
    } else {
      setLoading(false);
    }
  }, [navigate]);

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
          <div className="px-6 py-5 min-h-[calc(100vh-4rem)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
