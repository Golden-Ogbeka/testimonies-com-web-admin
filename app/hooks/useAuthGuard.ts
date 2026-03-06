import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { getSessionDetails, getTokenDetails } from '../functions/userSession';
import { RoutePaths } from '../routes/route-paths';
import { sendFeedback } from '../functions/feedback';

type AuthGuardMode = 'auth' | 'dashboard';

const isAuthenticated = () => {
  const currentAdmin = getSessionDetails();
  const currentToken = getTokenDetails();
  return Boolean(currentAdmin && currentToken);
};

export const useAuthGuard = (mode: AuthGuardMode) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authed = isAuthenticated();

    if (mode === 'dashboard') {
      if (!authed) {
        sendFeedback('Login to continue');
        navigate(RoutePaths.LOGIN);
        return;
      }
      setLoading(false);
      return;
    }

    if (authed) {
      navigate(RoutePaths.DASHBOARD);
      return;
    }

    setLoading(false);
  }, [location.pathname, mode, navigate]);

  return { loading };
};
