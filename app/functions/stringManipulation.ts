/**
 * Converts a snake_case or SCREAMING_SNAKE_CASE string to PascalCase.
 * Example: SUCCESSFUL_OTP_VERIFICATION -> Successful Otp Verification
 *
 * @param str - The string to convert
 * @returns The converted PascalCase string
 */
export const toPascalCase = (str: string): string => {
  if (!str) return '';

  return str
    .toLowerCase()
    .split(/['_']/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
