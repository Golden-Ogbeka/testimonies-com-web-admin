import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { AdminAuthApi } from '../../api/adminAuth';
import PasswordInput from '../../common/password-input';
import TextInput from '../../common/text-input';
import { sendCatchFeedback, sendFeedback } from '../../functions/feedback';
import { RoutePaths } from '../../routes/route-paths';
import { loginSchema, type LoginFormData } from '../../schemas';

export function meta() {
  return [
    { title: 'Admin Login | Testimonies' },
    {
      name: 'description',
      content: 'Secure admin access for Testimonies platform.',
    },
  ];
}

export default function LoginRoute() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { data: response } = await AdminAuthApi.login(data);
      sendFeedback(response.message, 'success');
      navigate(RoutePaths.VERIFY_OTP, {
        state: { email: data.email },
      });
    } catch (error) {
      sendCatchFeedback(error);
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          id="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending OTP...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
