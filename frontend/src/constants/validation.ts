// Email validation pattern
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password constraints
export const PASSWORD_MIN_LENGTH = 8;
// Password must contain at least: 1 uppercase, 1 lowercase, 1 number, 1 special character
export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;

// Username constraints
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const FULLNAME_MIN_LENGTH = 2;
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
