import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { AdminAuthApi } from '../../api/adminAuth';
import TextInput from '../../common/text-input';
import { sendCatchFeedback, sendFeedback } from '../../functions/feedback';
import { RoutePaths } from '../../routes/route-paths';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '../../schemas';

export function meta() {
  return [
    { title: 'Forgot password | Testimonies Admin' },
    {
      name: 'description',
      content: 'Request a password reset code for your admin account.',
    },
  ];
}

export default function ForgotPasswordRoute() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await AdminAuthApi.requestPasswordReset(data.email);
      sendFeedback('Password reset code sent to your email', 'success');
      navigate(RoutePaths.RESET_PASSWORD, { state: { email: data.email } });
    } catch (error) {
      sendCatchFeedback(error);
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Forgot password
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter the email associated with your admin account and we&apos;ll send
          a reset code.
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

        <button
          type="submit"
          className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending code...' : 'Send reset code'}
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
