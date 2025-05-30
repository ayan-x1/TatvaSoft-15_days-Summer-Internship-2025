import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null;
    }

    const errors: ValidationErrors = {};

    // At least 8 characters
    if (value.length < 8) {
      errors['minLength'] = true;
    }

    // At least one uppercase letter
    if (!/[A-Z]/.test(value)) {
      errors['hasUpperCase'] = true;
    }

    // At least one lowercase letter
    if (!/[a-z]/.test(value)) {
      errors['hasLowerCase'] = true;
    }

    // At least one number
    if (!/\d/.test(value)) {
      errors['hasNumber'] = true;
    }

    // At least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors['hasSpecialChar'] = true;
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };
}

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  
  return null;
}