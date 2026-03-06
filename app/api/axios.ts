import axios from 'axios';
import { ADMIN_API_KEY, API_URL } from '../functions/environmentVariables';
import { getTokenDetails } from '../functions/userSession';
import { store } from '../store';
import { signOut } from '../store/slices/admin';

const createRequestId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const appAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

appAxios.interceptors.request.use(
  (config) => {
    const { admin } = store.getState();

    const storeToken = admin.token;
    const tokenFromSession = getTokenDetails();
    const token = storeToken?.token ?? tokenFromSession?.token;

    if (ADMIN_API_KEY) {
      config.headers['x-admin-api-key'] = ADMIN_API_KEY;
    }

    if (token) {
      config.headers['x-jwt-token'] = token;
    }

    if (!config.headers['x-request-id']) {
      config.headers['x-request-id'] = createRequestId();
    }

    return config;
  },
  (error) => Promise.reject(error),
);

appAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status as number | undefined;

    if (status === 401 || status === 403) {
      store.dispatch(signOut());
    }

    return Promise.reject(error);
  },
);
