export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateIdentifier = (identifier: string): ValidationResult => {
  if (!identifier || identifier.trim() === '') {
    return { isValid: false, error: 'Email or username is required.' };
  }
  if (identifier.includes('@')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(identifier.trim())) {
      return { isValid: false, error: 'Please enter a valid email format.' };
    }
  }
  return { isValid: true };
};

export const validateRegistrationEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. explorer@astrion.space).' };
  }
  return { isValid: true };
};

export const validateFullName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Full name is required.' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters.' };
  }
  return { isValid: true };
};

export const validatePassword = (password: string, fieldName = 'Password'): ValidationResult => {
  if (!password) {
    return { isValid: false, error: `${fieldName} is required.` };
  }
  if (password.length < 6) {
    return { isValid: false, error: `${fieldName} must be at least 6 characters.` };
  }
  return { isValid: true };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password.' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match.' };
  }
  return { isValid: true };
};
