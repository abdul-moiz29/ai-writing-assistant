export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

const validateEmail = (email: string): ValidationError | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { field: 'email', message: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'Please enter a valid email address' };
  }
  return null;
};

const validatePassword = (password: string): ValidationError | null => {
  if (!password) {
    return { field: 'password', message: 'Password is required' };
  }
  if (password.length < 8) {
    return { field: 'password', message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { field: 'password', message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { field: 'password', message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { field: 'password', message: 'Password must contain at least one number' };
  }
  return null;
};

const validateName = (name: string): ValidationError | null => {
  if (!name) {
    return { field: 'name', message: 'Name is required' };
  }
  if (name.length < 2) {
    return { field: 'name', message: 'Name must be at least 2 characters long' };
  }
  return null;
};

export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(email);
  if (emailError) errors.push(emailError);
  
  const passwordError = validatePassword(password);
  if (passwordError) errors.push(passwordError);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateSignupForm = (name: string, email: string, password: string): ValidationResult => {
  const errors: ValidationError[] = [];
  
  const nameError = validateName(name);
  if (nameError) errors.push(nameError);
  
  const emailError = validateEmail(email);
  if (emailError) errors.push(emailError);
  
  const passwordError = validatePassword(password);
  if (passwordError) errors.push(passwordError);
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 