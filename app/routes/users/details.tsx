import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AdminUsersApi } from '../../api/adminUsers';
import Modal from '../../common/modal';
import PageHeader from '../../common/page-header';
import { getResponseResource } from '../../functions/api-response';
import { sendCatchFeedback } from '../../functions/feedback';
import type { AdminUserSummary } from '../../types';
import { RoutePaths } from '../route-paths';

export function meta() {
  return [
    { title: 'User details | Testimonies Admin' },
    { name: 'description', content: 'View detailed user information.' },
  ];
}

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggleAction, setToggleAction] = useState<
    'activate' | 'deactivate' | null
  >(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const { data } = await AdminUsersApi.getById(id);
        setUser(getResponseResource<AdminUserSummary>(data, 'user'));
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleConfirm = async () => {
    if (!user || !toggleAction) return;
    try {
      setSubmitting(true);
      if (toggleAction === 'activate') {
        await AdminUsersApi.activate(user._id);
        setUser({ ...user, active: true });
      } else {
        await AdminUsersApi.deactivate(user._id);
        setUser({ ...user, active: false });
      }
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setSubmitting(false);
      setToggleAction(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-sm text-gray-600">User not found</p>
        <button
          type="button"
          onClick={() => navigate(RoutePaths.USERS)}
          className="mt-4 text-xs font-medium text-primary hover:underline"
        >
          Back to users
        </button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="User details"
        description={
          user.accountType === 'organization'
            ? user.businessName || `${user.firstName} ${user.lastName}`
            : `${user.firstName} ${user.lastName}`
        }
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(RoutePaths.USERS)}
              className="text-xs font-medium text-gray-600 hover:underline"
            >
              ← Back to users
            </button>
            <button
              type="button"
              onClick={() =>
                setToggleAction(user.active ? 'deactivate' : 'activate')
              }
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary/90"
            >
              {user.active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        }
      />

      <div className="card">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {user.accountType === 'organization' && user.businessLogoURL ? (
                <img
                  src={user.businessLogoURL}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile Image"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : user.accountType === 'organization' ? (
                (user.businessName || 'O').charAt(0).toUpperCase()
              ) : (
                user.firstName.charAt(0) + user.lastName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user.accountType === 'organization'
                  ? user.businessName || `${user.firstName} ${user.lastName}`
                  : `${user.firstName} ${user.lastName}`}
              </h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium text-gray-500">
                Status
              </label>
              <div className="mt-1">
                {user.active ? (
                  <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">
                Flagged
              </label>
              <div className="mt-1">
                {user.isFlagged ? (
                  <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                    Yes
                  </span>
                ) : (
                  <span className="text-xs text-gray-600">No</span>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">
                Account type
              </label>
              <p className="mt-1 text-sm capitalize text-gray-900">
                {user.accountType}
              </p>
            </div>

            {user.subscriptionType && (
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Subscription type
                </label>
                <p className="mt-1 text-sm capitalize text-gray-900">
                  {user.subscriptionType}
                </p>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-500">
                Profile visibility
              </label>
              <p className="mt-1 text-sm capitalize text-gray-900">
                {user.profileVisibility}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">
                KYC Completed
              </label>
              <p className="mt-1 text-sm capitalize text-gray-900">
                {user.kycCompleted ? 'Yes' : 'No'}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">
                Email verified
              </label>
              <p className="mt-1 text-sm capitalize text-gray-900">
                {user.emailIsVerified ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                Phone number verified
              </label>
              <p className="mt-1 text-sm capitalize text-gray-900">
                {user.phoneNumberIsVerified ? 'Yes' : 'No'}
              </p>
            </div>

            {user.username && (
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Username
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.username}</p>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-gray-500">
                User ID
              </label>
              <p className="mt-1 font-mono text-xs text-gray-900">{user._id}</p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">
                Created at
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={toggleAction !== null}
        title={`${toggleAction === 'activate' ? 'Activate' : 'Deactivate'} user`}
        primaryLabel="Confirm"
        onPrimary={handleConfirm}
        onClose={() => setToggleAction(null)}
        loading={submitting}
      >
        <p className="text-sm text-gray-700">
          Are you sure you want to {toggleAction} this user&apos;s account?
        </p>
      </Modal>
    </>
  );
}
