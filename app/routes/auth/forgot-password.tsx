import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AdminAuthApi } from "../../api/adminAuth";
import { sendCatchFeedback, sendFeedback } from "../../functions/feedback";
import { RoutePaths } from "../../routes/route-paths";

interface ForgotPasswordState {
  email: string;
  submitting: boolean;
}

export function meta() {
  return [
    { title: "Forgot password | Testimonies Admin" },
    {
      name: "description",
      content: "Request a password reset code for your admin account.",
    },
  ];
}

export default function ForgotPasswordRoute() {
  const navigate = useNavigate();
  const [state, setState] = useState<ForgotPasswordState>({
    email: "",
    submitting: false,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!state.email) {
      sendFeedback("Enter your email address", "warning");
      return;
    }

    try {
      setState((prev) => ({ ...prev, submitting: true }));
      await AdminAuthApi.requestPasswordReset(state.email);
      sendFeedback("Password reset code sent to your email", "success");
      navigate(RoutePaths.RESET_PASSWORD, { state: { email: state.email } });
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setState((prev) => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Forgot password</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter the email associated with your admin account and we&apos;ll send a reset
          code.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="inputContainer">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            value={state.email}
            onChange={(event) =>
              setState((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <button
          type="submit"
          className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={state.submitting}
        >
          {state.submitting ? "Sending code..." : "Send reset code"}
        </button>

        <button
          type="button"
          className="mt-2 w-full text-center text-xs text-slate-500 hover:text-slate-700"
          onClick={() => navigate(RoutePaths.LOGIN)}
        >
          Back to login
        </button>
      </form>
    </div>
  );
}

