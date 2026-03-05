import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { AdminAuthApi } from '../../api/adminAuth';
import OtpInput from '../../common/otp-input';
import PasswordInput from '../../common/password-input';
import TextInput from '../../common/text-input';
import { sendCatchFeedback, sendFeedback } from '../../functions/feedback';
import { RoutePaths } from '../../routes/route-paths';
import { resetPasswordSchema, type ResetPasswordFormData } from '../../schemas';

interface LocationState {
  email?: string;
}

export function meta() {
  return [
    { title: 'Reset password | Testimonies Admin' },
    {
      name: 'description',
      content:
        'Set a new password for your admin account using the reset code.',
    },
  ];
}

export default function ResetPasswordRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: locationState?.email ?? '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await AdminAuthApi.resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.password,
      });
      sendFeedback('Password reset successfully', 'success');
      navigate(RoutePaths.LOGIN);
    } catch (error) {
      sendCatchFeedback(error);
    }
  };

  const handleOtpChange = (otp: string) => {
    setValue('otp', otp);
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Set a new password
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter the reset code sent to your email and choose a strong new
          password.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <OtpInput
          value={watch('otp')}
          onChange={handleOtpChange}
          label="Reset code"
          error={errors.otp?.message}
        />

        <PasswordInput
          id="password"
          label="New password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          {...register('password')}
          error={errors.password?.message}
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm new password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <button
          type="submit"
          className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating password...' : 'Update password'}
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
