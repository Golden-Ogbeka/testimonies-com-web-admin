import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useNavigate,
} from "react-router";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import type { Route } from "./+types/root";
import "./app.css";
import "react-toastify/dist/ReactToastify.css";
import FullPageLoader from "./common/full-page-loader";
import { getSessionDetails, getTokenDetails } from "./functions/userSession";
import { store } from "./store";
import { useAppDispatch } from "./store/hooks";
import { updateAdmin, updateToken } from "./store/slices/admin";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Provider store={store}>
          {children}
          <ToastContainer
            style={{
              fontSize: 16,
              zIndex: 90,
            }}
            theme="colored"
            autoClose={5000}
            position="top-right"
            hideProgressBar
            closeOnClick
          />
        </Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getTokenDetails();
    const admin = getSessionDetails();

    if (token) {
      dispatch(updateToken({ token }));
    }

    if (admin) {
      dispatch(updateAdmin({ profile: admin }));
    }
  }, [dispatch]);

  return (
    <>
      {isNavigating && <FullPageLoader />}
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-2xl p-8 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">{message}</h1>
        <p className="text-gray-600">{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto bg-gray-100 rounded-lg text-xs text-gray-800">
            <code>{stack}</code>
          </pre>
        )}
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Go back
          </button>
        </div>
      </div>
    </main>
  );
}
