import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AdminAuthApi } from '../../api/adminAuth';
import PageHeader from '../../common/page-header';
import PasswordInput from '../../common/password-input';
import TextInput from '../../common/text-input';
import { getResponseData } from '../../functions/api-response';
import {
  sendCatchFeedback,
  sendSuccessFeedback,
} from '../../functions/feedback';
import {
  changePasswordSchema,
  updateProfileSchema,
  type ChangePasswordFormData,
  type UpdateProfileFormData,
} from '../../schemas';
import type { AdminProfile } from '../../types/auth';

export function meta() {
  return [
    { title: 'Profile settings | Testimonies Admin' },
    { name: 'description', content: 'Manage your admin profile and password.' },
  ];
}

export default function ProfileSettings() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSaving },
    reset: resetProfile,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordChanging },
    reset: resetPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminAuthApi.getProfile();
        const admin = getResponseData<AdminProfile>(data);
        setProfile(admin);
        resetProfile({
          firstName: admin.firstName,
          lastName: admin.lastName,
          phoneNumber: admin.phoneNumber || '',
        });
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [resetProfile]);

  const onSaveProfile = async (data: UpdateProfileFormData) => {
    try {
      const { data: response } = await AdminAuthApi.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || undefined,
      });
      setProfile(getResponseData<AdminProfile>(response));
      sendSuccessFeedback('Profile updated successfully');
    } catch (error) {
      sendCatchFeedback(error);
    }
  };

  const onChangePassword = async (data: ChangePasswordFormData) => {
    try {
      await AdminAuthApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      resetPassword();
      sendSuccessFeedback('Password changed successfully');
    } catch (error) {
      sendCatchFeedback(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-600">Unable to load profile</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Profile settings"
        description="Manage your personal information and security settings."
      />

      <div className="space-y-6">
        <div className="card">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Personal information
          </h3>
          <form
            onSubmit={handleProfileSubmit(onSaveProfile)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                id="profile-first"
                label="First name"
                {...registerProfile('firstName')}
                error={profileErrors.firstName?.message}
              />
              <TextInput
                id="profile-last"
                label="Last name"
                {...registerProfile('lastName')}
                error={profileErrors.lastName?.message}
              />
            </div>
            <div className="inputContainer">
              <label htmlFor="profile-email">Email</label>
              <input
                id="profile-email"
                type="email"
                value={profile.email}
                disabled
              />
            </div>
            <TextInput
              id="profile-phone"
              label="Phone number (optional)"
              type="tel"
              {...registerProfile('phoneNumber')}
              error={profileErrors.phoneNumber?.message}
            />
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div>
                <span className="font-medium">Role:</span>{' '}
                <span className="capitalize">{profile.role}</span>
              </div>
              <div>
                <span className="font-medium">Status:</span>{' '}
                {profile.active ? (
                  <span className="text-emerald-600">Active</span>
                ) : (
                  <span className="text-gray-500">Inactive</span>
                )}
              </div>
              <div>
                <span className="font-medium">Email verified:</span>{' '}
                {profile.emailIsVerified ? (
                  <span className="text-emerald-600">Yes</span>
                ) : (
                  <span className="text-gray-500">No</span>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isProfileSaving}
              className="btn-primary"
            >
              {isProfileSaving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Change password
          </h3>
          <form
            onSubmit={handlePasswordSubmit(onChangePassword)}
            className="space-y-4"
          >
            <PasswordInput
              id="current-password"
              label="Current password"
              autoComplete="current-password"
              {...registerPassword('currentPassword')}
              error={passwordErrors.currentPassword?.message}
            />
            <PasswordInput
              id="new-password"
              label="New password"
              autoComplete="new-password"
              {...registerPassword('newPassword')}
              error={passwordErrors.newPassword?.message}
            />
            <PasswordInput
              id="confirm-password"
              label="Confirm new password"
              autoComplete="new-password"
              {...registerPassword('confirmPassword')}
              error={passwordErrors.confirmPassword?.message}
            />
            <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
              <p className="font-medium mb-1">Password requirements:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains at least one number</li>
                <li>Contains at least one special character (!@#$%^&*)</li>
              </ul>
            </div>
            <button
              type="submit"
              disabled={isPasswordChanging}
              className="btn-primary"
            >
              {isPasswordChanging ? 'Changing…' : 'Change password'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
