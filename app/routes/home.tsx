import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from './+types/home';
import { getSessionDetails } from '../functions/userSession';
import { RoutePaths } from '../routes/route-paths';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Testimonies Admin' },
    {
      name: 'description',
      content: 'Administration console for managing the Testimonies platform.',
    },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const admin = getSessionDetails();
    if (admin) {
      navigate(RoutePaths.DASHBOARD, { replace: true });
    } else {
      navigate(RoutePaths.LOGIN, { replace: true });
    }
  }, [navigate]);

  return null;
}
