import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AdminAuthApi } from "../../api/adminAuth";
import OtpInput from "../../common/otp-input";
import { sendCatchFeedback, sendFeedback } from "../../functions/feedback";
import { RoutePaths } from "../../routes/route-paths";
import { useAppDispatch } from "../../store/hooks";
import { updateAdmin, updateToken } from "../../store/slices/admin";

interface VerifyOtpState {
  email: string;
  otp: string;
  submitting: boolean;
}

interface LocationState {
  email?: string;
}

export function meta() {
  return [
    { title: "Verify OTP | Testimonies Admin" },
    {
      name: "description",
      content: "Verify your one-time password to access the admin dashboard.",
    },
  ];
}

export default function VerifyOtpRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [state, setState] = useState<VerifyOtpState>({
    email: "",
    otp: "",
    submitting: false,
  });

  useEffect(() => {
    const locationState = location.state as LocationState | null;
    if (locationState?.email) {
      setState((prev) => ({ ...prev, email: locationState.email || "" }));
    }
  }, [location.state]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, email: event.target.value }));
  };

  const handleOtpChange = (otp: string) => {
    setState((prev) => ({ ...prev, otp }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!state.email || !state.otp) {
      sendFeedback("Provide your email and OTP code", "warning");
      return;
    }

    if (state.otp.length !== 6) {
      sendFeedback("OTP must be 6 digits", "warning");
      return;
    }

    try {
      setState((prev) => ({ ...prev, submitting: true }));
      const { data } = await AdminAuthApi.verifyOtp({
        email: state.email,
        otp: state.otp,
      });

      const { token, admin } = data.data;
      
      // Store token and admin profile
      dispatch(updateToken({ token: { token } }));
      dispatch(updateAdmin({ profile: admin }));

      sendFeedback("Verification successful", "success");
      
      // Navigate to dashboard
      navigate(RoutePaths.DASHBOARD, { replace: true });
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setState((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleResendOtp = async () => {
    if (!state.email) {
      sendFeedback("Enter your email address first", "warning");
      return;
    }

    try {
      await AdminAuthApi.resendOtp(state.email);
      sendFeedback("OTP sent to your email", "success");
    } catch (error) {
      sendCatchFeedback(error);
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Verify OTP</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter the 6-digit code sent to your email to complete sign in.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="inputContainer">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            value={state.email}
            onChange={handleEmailChange}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <OtpInput
          value={state.otp}
          onChange={handleOtpChange}
          label="One-time password"
        />

        <div className="flex items-center justify-between text-xs text-slate-500">
          <button
            type="button"
            className="text-primary font-medium hover:underline"
            onClick={handleResendOtp}
          >
            Resend code
          </button>
        </div>

        <button
          type="submit"
          className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={state.submitting}
        >
          {state.submitting ? "Verifying..." : "Verify and continue"}
        </button>
      </form>
    </div>
  );
}

