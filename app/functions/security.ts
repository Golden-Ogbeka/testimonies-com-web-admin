/**
 * Security utilities for the admin dashboard
 */

/**
 * Sanitize HTML to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  const div = document.createElement("div");
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const isStrongPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*]/.test(password)) return false;
  return true;
};

/**
 * Get password strength message
 */
export const getPasswordStrengthMessage = (password: string): string | null => {
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  if (!/[!@#$%^&*]/.test(password))
    return "Password must contain at least one special character (!@#$%^&*)";
  return null;
};

/**
 * Validate MongoDB ObjectId format
 */
export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Escape special characters in strings for safe display
 */
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

/**
 * Check if the current session is expired
 */
export const isSessionExpired = (expiryTime: number): boolean => {
  return Date.now() > expiryTime;
};

/**
 * Generate a secure random string
 */
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

/**
 * Validate phone number format (basic validation)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Basic validation: 10-15 digits, may start with +
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return phoneRegex.test(phone.replace(/[\s-()]/g, ""));
};

/**
 * Rate limiting helper - check if action is allowed
 */
export const checkRateLimit = (
  key: string,
  maxAttempts: number,
  windowMs: number,
): boolean => {
  const now = Date.now();
  const storageKey = `rate_limit_${key}`;
  const stored = localStorage.getItem(storageKey);

  if (!stored) {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ count: 1, resetTime: now + windowMs }),
    );
    return true;
  }

  const data = JSON.parse(stored);

  if (now > data.resetTime) {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ count: 1, resetTime: now + windowMs }),
    );
    return true;
  }

  if (data.count >= maxAttempts) {
    return false;
  }

  data.count += 1;
  localStorage.setItem(storageKey, JSON.stringify(data));
  return true;
};

/**
 * Clear rate limit for a key
 */
export const clearRateLimit = (key: string): void => {
  localStorage.removeItem(`rate_limit_${key}`);
};
