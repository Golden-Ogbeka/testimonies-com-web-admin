import { useEffect, useState } from "react";
import { AdminAuthApi } from "../../api/adminAuth";
import PageHeader from "../../common/page-header";
import PasswordInput from "../../common/password-input";
import { getResponseData } from "../../functions/api-response";
import { sendCatchFeedback, sendSuccessFeedback } from "../../functions/feedback";
import { getPasswordStrengthMessage, isStrongPassword } from "../../functions/security";
import type { AdminProfile } from "../../types/auth";

export function meta() {
  return [
    { title: "Profile settings | Testimonies Admin" },
    { name: "description", content: "Manage your admin profile and password." },
  ];
}

export default function ProfileSettings() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await AdminAuthApi.getProfile();
        const admin = getResponseData<AdminProfile>(data);
        setProfile(admin);
        setFirstName(admin.firstName);
        setLastName(admin.lastName);
        setPhoneNumber(admin.phoneNumber || "");
      } catch (error) {
        sendCatchFeedback(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (newPassword) {
      const error = getPasswordStrengthMessage(newPassword);
      setPasswordError(error);
    } else {
      setPasswordError(null);
    }
  }, [newPassword]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const { data } = await AdminAuthApi.updateProfile({
        firstName,
        lastName,
        phoneNumber: phoneNumber || undefined,
      });
      setProfile(getResponseData<AdminProfile>(data));
      sendSuccessFeedback("Profile updated successfully");
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      sendCatchFeedback(new Error("Passwords do not match"));
      return;
    }
    
    if (!isStrongPassword(newPassword)) {
      sendCatchFeedback(new Error(passwordError || "Password does not meet requirements"));
      return;
    }

    if (newPassword === currentPassword) {
      sendCatchFeedback(new Error("New password must be different from current password"));
      return;
    }

    try {
      setChangingPassword(true);
      await AdminAuthApi.changePassword({
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      sendSuccessFeedback("Password changed successfully");
    } catch (error) {
      sendCatchFeedback(error);
    } finally {
      setChangingPassword(false);
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="inputContainer">
                <label htmlFor="profile-first">First name</label>
                <input
                  id="profile-first"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="inputContainer">
                <label htmlFor="profile-last">Last name</label>
                <input
                  id="profile-last"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
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
            <div className="inputContainer">
              <label htmlFor="profile-phone">Phone number (optional)</label>
              <input
                id="profile-phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div>
                <span className="font-medium">Role:</span>{" "}
                <span className="capitalize">{profile.role}</span>
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                {profile.active ? (
                  <span className="text-emerald-600">Active</span>
                ) : (
                  <span className="text-gray-500">Inactive</span>
                )}
              </div>
              <div>
                <span className="font-medium">Email verified:</span>{" "}
                {profile.emailIsVerified ? (
                  <span className="text-emerald-600">Yes</span>
                ) : (
                  <span className="text-gray-500">No</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Change password</h3>
          <div className="space-y-4">
            <PasswordInput
              id="current-password"
              label="Current password"
              value={currentPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
            <PasswordInput
              id="new-password"
              label="New password"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              error={passwordError || undefined}
            />
            <PasswordInput
              id="confirm-password"
              label="Confirm new password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
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
              type="button"
              onClick={handleChangePassword}
              disabled={
                changingPassword ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                !!passwordError
              }
              className="btn-primary"
            >
              {changingPassword ? "Changing…" : "Change password"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
