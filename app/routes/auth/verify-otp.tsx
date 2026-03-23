import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import LoadingIndicator from '~/common/loading-indicator';
import { AdminAuthApi } from '../../api/adminAuth';
import OtpInput from '../../common/otp-input';
import TextInput from '../../common/text-input';
import { sendCatchFeedback, sendFeedback } from '../../functions/feedback';
import { RoutePaths } from '../../routes/route-paths';
import { verifyOtpSchema, type VerifyOtpFormData } from '../../schemas';
import { useAppDispatch } from '../../store/hooks';
import { updateAdmin, updateToken } from '../../store/slices/admin';

interface LocationState {
  email?: string;
}

export function meta() {
  return [
    { title: 'Verify OTP | Testimonies Admin' },
    {
      name: 'description',
      content: 'Verify your one-time password to access the admin dashboard.',
    },
  ];
}

export default function VerifyOtpRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: '',
      otp: '',
    },
  });
  const [resendOtpLoading, setResendOtpLoading] = useState(false);

  const otp = watch('otp');

  useEffect(() => {
    const locationState = location.state as LocationState | null;
    if (locationState?.email) {
      setValue('email', locationState.email);
    }
  }, [location.state, setValue]);

  const onSubmit = async (data: VerifyOtpFormData) => {
    try {
      const { data: response } = await AdminAuthApi.verifyOtp(data);
      const { token, admin } = response.data;

      // Store token and admin profile
      dispatch(updateToken({ token: { token } }));
      dispatch(updateAdmin({ profile: admin }));

      sendFeedback('Verification successful', 'success');

      // Navigate to dashboard
      navigate(RoutePaths.DASHBOARD, { replace: true });
    } catch (error) {
      sendCatchFeedback(error);
    }
  };

  const handleResendOtp = async () => {
    const email = watch('email');
    if (!email) {
      sendFeedback('Enter your email address first', 'warning');
      return;
    }

    try {
      setResendOtpLoading(true);
      await AdminAuthApi.resendOtp(email);
      sendFeedback('OTP sent to your email', 'success');
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setResendOtpLoading(false);
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

        <OtpInput
          value={otp || ''}
          onChange={(value) => setValue('otp', value)}
          label="One-time password"
          error={errors.otp?.message}
        />

        <div className="flex items-center justify-between text-xs text-slate-500">
          <button
            type="button"
            className="text-primary font-medium hover:underline flex items-center gap-2"
            onClick={handleResendOtp}
            disabled={resendOtpLoading}
          >
            {resendOtpLoading && <LoadingIndicator size={12} />}{' '}
            {resendOtpLoading ? 'Sending...' : 'Resend code'}
          </button>
        </div>

        <button
          type="submit"
          className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Verifying...' : 'Verify and continue'}
        </button>
      </form>
    </div>
  );
}
