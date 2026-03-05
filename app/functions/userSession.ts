import type { AdminProfile, AdminToken } from '../types/auth';
import {
  SESSION_KEY,
  SESSION_NAME,
  TOKEN_KEY,
  TOKEN_NAME,
} from './environmentVariables';
import { decryptItem, encryptItem } from './encryption';
import { sendCatchFeedback } from './feedback';

export const getSessionDetails = (): AdminProfile | null => {
  try {
    if (typeof window !== 'undefined') {
      const encryptedSession = window.localStorage.getItem(SESSION_NAME);
      if (encryptedSession) {
        return decryptItem<AdminProfile>(encryptedSession, SESSION_KEY);
      }
    }
  } catch (error) {
    sendCatchFeedback(error);
  }
  return null;
};

export const storeSessionDetails = (sessionDetails: AdminProfile): boolean => {
  try {
    const encryptedSession = encryptItem(sessionDetails, SESSION_KEY);
    window.localStorage.setItem(SESSION_NAME, encryptedSession);
    return true;
  } catch (error) {
    sendCatchFeedback(error);
    return false;
  }
};

export const removeSessionDetails = (): boolean => {
  try {
    window.localStorage.removeItem(SESSION_NAME);
    return true;
  } catch (error) {
    sendCatchFeedback(error);
    return false;
  }
};

export const getTokenDetails = (): AdminToken | null => {
  try {
    if (typeof window !== 'undefined') {
      const encryptedToken = window.localStorage.getItem(TOKEN_NAME);
      if (encryptedToken) {
        return decryptItem<AdminToken>(encryptedToken, TOKEN_KEY);
      }
    }
  } catch (error) {
    sendCatchFeedback(error);
  }
  return null;
};

export const storeTokenDetails = (token: AdminToken): boolean => {
  try {
    const encryptedToken = encryptItem(token, TOKEN_KEY);
    window.localStorage.setItem(TOKEN_NAME, encryptedToken);
    return true;
  } catch (error) {
    sendCatchFeedback(error);
    return false;
  }
};

export const removeTokenDetails = (): boolean => {
  try {
    window.localStorage.removeItem(TOKEN_NAME);
    return true;
  } catch (error) {
    sendCatchFeedback(error);
    return false;
  }
};
