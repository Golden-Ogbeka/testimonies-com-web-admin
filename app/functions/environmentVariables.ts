export const API_URL: string = import.meta.env.VITE_API_URL as string;

export const ADMIN_API_KEY: string | undefined = import.meta.env
  .VITE_ADMIN_API_KEY as string | undefined;

export const SESSION_NAME: string =
  (import.meta.env.VITE_ADMIN_SESSION_NAME as string | undefined) ??
  "testimonies_admin_session";

export const SESSION_KEY: string =
  (import.meta.env.VITE_ADMIN_SESSION_KEY as string | undefined) ??
  "testimonies_admin_session_key";

export const TOKEN_NAME: string =
  (import.meta.env.VITE_ADMIN_TOKEN_NAME as string | undefined) ??
  "testimonies_admin_token";

export const TOKEN_KEY: string =
  (import.meta.env.VITE_ADMIN_TOKEN_KEY as string | undefined) ??
  "testimonies_admin_token_key";

