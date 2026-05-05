export interface ValidationError {
  field: string;
  message: string;
}

export function validateRequired(value: string, fieldName: string): ValidationError | null {
  if (!value || value.trim().length === 0) {
    return { field: fieldName, message: `${fieldName} is required` };
  }
  return null;
}

export function validatePositiveNumber(value: number, fieldName: string): ValidationError | null {
  if (isNaN(value) || value <= 0) {
    return { field: fieldName, message: `${fieldName} must be a positive number` };
  }
  return null;
}

export function validateMaxLength(value: string, max: number, fieldName: string): ValidationError | null {
  if (value && value.length > max) {
    return { field: fieldName, message: `${fieldName} must be ${max} characters or fewer` };
  }
  return null;
}

export function validateEmail(value: string): ValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return { field: "email", message: "Enter a valid email address" };
  }
  return null;
}

export function collectErrors(...errors: (ValidationError | null)[]): ValidationError[] {
  return errors.filter((e): e is ValidationError => e !== null);
}
