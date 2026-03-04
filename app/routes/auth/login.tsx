import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AdminAuthApi } from "../../api/adminAuth";
import PasswordInput from "../../common/password-input";
import { sendCatchFeedback, sendFeedback } from "../../functions/feedback";
import { RoutePaths } from "../../routes/route-paths";

export function meta() {
  return [
    { title: "Admin Login | Testimonies" },
    { name: "description", content: "Secure admin access for Testimonies platform." },
  ];
}

interface LoginFormState {
  email: string;
  password: string;
  submitting: boolean;
}

export default function LoginRoute() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
    submitting: false,
  });

  const handleChange = (field: keyof Omit<LoginFormState, "submitting">) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      sendFeedback("Enter your email and password", "warning");
      return;
    }

    try {
      setForm((prev) => ({ ...prev, submitting: true }));
      const { data } = await AdminAuthApi.login({
        email: form.email,
        password: form.password,
      });

      sendFeedback(data.message, "success");
      navigate(RoutePaths.VERIFY_OTP, {
        state: { email: form.email },
      });
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setForm((prev) => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">
          Sign in with your admin credentials to continue.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="inputContainer">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <PasswordInput
          id="password"
          label="Password"
          value={form.password}
          onChange={handleChange("password")}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-xs text-slate-500">
          <button
            type="button"
            className="text-primary font-medium hover:underline"
            onClick={() => navigate(RoutePaths.FORGOT_PASSWORD)}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={form.submitting}
        >
          {form.submitting ? "Sending OTP..." : "Continue"}
        </button>
      </form>
    </div>
  );
}

