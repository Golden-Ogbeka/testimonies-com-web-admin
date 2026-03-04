import type { FormEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AdminAuthApi } from "../../api/adminAuth";
import OtpInput from "../../common/otp-input";
import PasswordInput from "../../common/password-input";
import { sendCatchFeedback, sendFeedback } from "../../functions/feedback";
import { getPasswordStrengthMessage, isStrongPassword } from "../../functions/security";
import { RoutePaths } from "../../routes/route-paths";

interface ResetPasswordState {
  email: string;
  otp: string;
  newPassword: string;
  submitting: boolean;
  passwordError: string;
}

interface LocationState {
  email?: string;
}

export function meta() {
  return [
    { title: "Reset password | Testimonies Admin" },
    {
      name: "description",
      content: "Set a new password for your admin account using the reset code.",
    },
  ];
}

export default function ResetPasswordRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;

  const [state, setState] = useState<ResetPasswordState>({
    email: locationState?.email ?? "",
    otp: "",
    newPassword: "",
    submitting: false,
    passwordError: "",
  });

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    const error = password && !isStrongPassword(password) ? getPasswordStrengthMessage(password) : "";
    setState((prev) => ({
      ...prev,
      newPassword: password,
      passwordError: error || "",
    }));
  };

  const handleOtpChange = (otp: string) => {
    setState((prev) => ({ ...prev, otp }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!state.email || !state.otp || !state.newPassword) {
      sendFeedback("Fill in all fields", "warning");
      return;
    }

    if (state.otp.length !== 6) {
      sendFeedback("Reset code must be 6 digits", "warning");
      return;
    }

    if (!isStrongPassword(state.newPassword)) {
      sendFeedback("Password does not meet requirements", "warning");
      return;
    }

    try {
      setState((prev) => ({ ...prev, submitting: true }));
      await AdminAuthApi.resetPassword({
        email: state.email,
        otp: state.otp,
        newPassword: state.newPassword,
      });
      sendFeedback("Password reset successfully", "success");
      navigate(RoutePaths.LOGIN, { replace: true });
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setState((prev) => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Set a new password</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter the reset code sent to your email and choose a strong new password.
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

        <OtpInput
          value={state.otp}
          onChange={handleOtpChange}
          label="Reset code"
        />

        <PasswordInput
          id="newPassword"
          label="New password"
          value={state.newPassword}
          onChange={handlePasswordChange}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={state.passwordError}
        />

        <button
          type="submit"
          className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={state.submitting}
        >
          {state.submitting ? "Updating password..." : "Update password"}
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

