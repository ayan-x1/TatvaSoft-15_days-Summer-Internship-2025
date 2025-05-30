import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { strongPasswordValidator, passwordMatchValidator } from '../password.validator';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <div class="row w-100 justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-lg border-0">
            <div class="card-header bg-success text-white text-center py-3">
              <h3 class="mb-0">
                <i class="fas fa-user-plus me-2"></i>Create Account
              </h3>
            </div>
            <div class="card-body p-4">
              <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-12 mb-3">
                    <label for="name" class="form-label">
                      <i class="fas fa-user me-1"></i>Full Name
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      formControlName="name"
                      placeholder="Enter your full name"
                      [ngClass]="{'is-invalid': signupForm.get('name')?.invalid && signupForm.get('name')?.touched}"
                    >
                    <div class="invalid-feedback" *ngIf="signupForm.get('name')?.errors?.['required'] && signupForm.get('name')?.touched">
                      Full name is required
                    </div>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="email" class="form-label">
                    <i class="fas fa-envelope me-1"></i>Email Address
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    formControlName="email"
                    placeholder="Enter your email"
                    [ngClass]="{'is-invalid': signupForm.get('email')?.invalid && signupForm.get('email')?.touched}"
                  >
                  <div class="invalid-feedback" *ngIf="signupForm.get('email')?.errors?.['required'] && signupForm.get('email')?.touched">
                    Email is required
                  </div>
                  <div class="invalid-feedback" *ngIf="signupForm.get('email')?.errors?.['email'] && signupForm.get('email')?.touched">
                    Please enter a valid email address
                  </div>
                </div>
                
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="password" class="form-label">
                      <i class="fas fa-lock me-1"></i>Password
                    </label>
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      formControlName="password"
                      placeholder="Create password"
                      [ngClass]="{'is-invalid': signupForm.get('password')?.invalid && signupForm.get('password')?.touched}"
                    >
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="confirmPassword" class="form-label">
                      <i class="fas fa-lock me-1"></i>Confirm Password
                    </label>
                    <input
                      type="password"
                      class="form-control"
                      id="confirmPassword"
                      formControlName="confirmPassword"
                      placeholder="Confirm password"
                      [ngClass]="{'is-invalid': (signupForm.get('confirmPassword')?.invalid || signupForm.errors?.['passwordMismatch']) && signupForm.get('confirmPassword')?.touched}"
                    >
                  </div>
                </div>
                
                <!-- Password Requirements -->
                <div class="mb-3" *ngIf="signupForm.get('password')?.touched">
                  <div class="card bg-light">
                    <div class="card-body py-2">
                      <small class="text-muted fw-bold">Password Requirements:</small>
                      <div class="mt-2">
                        <small [ngClass]="getPasswordRequirementClass('minLength')">
                          <i [ngClass]="getPasswordRequirementIcon('minLength')"></i>
                          At least 8 characters long
                        </small><br>
                        <small [ngClass]="getPasswordRequirementClass('hasUpperCase')">
                          <i [ngClass]="getPasswordRequirementIcon('hasUpperCase')"></i>
                          One uppercase letter (A-Z)
                        </small><br>
                        <small [ngClass]="getPasswordRequirementClass('hasLowerCase')">
                          <i [ngClass]="getPasswordRequirementIcon('hasLowerCase')"></i>
                          One lowercase letter (a-z)
                        </small><br>
                        <small [ngClass]="getPasswordRequirementClass('hasNumber')">
                          <i [ngClass]="getPasswordRequirementIcon('hasNumber')"></i>
                          One number (0-9)
                        </small><br>
                        <small [ngClass]="getPasswordRequirementClass('hasSpecialChar')">
                          <i [ngClass]="getPasswordRequirementIcon('hasSpecialChar')"></i>
                          One special character (!&#64;#$%^&*)
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Password Mismatch Error -->
                <div class="alert alert-danger py-2" *ngIf="signupForm.errors?.['passwordMismatch'] && signupForm.get('confirmPassword')?.touched">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  Passwords do not match
                </div>
                
                <div class="d-grid gap-2 mb-3">
                  <button 
                    type="submit" 
                    class="btn btn-success btn-lg"
                    [disabled]="signupForm.invalid || isLoading"
                  >
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="fas fa-user-plus me-2" *ngIf="!isLoading"></i>
                    {{ isLoading ? 'Creating Account...' : 'Create Account' }}
                  </button>
                </div>
                
                <div class="alert alert-danger" *ngIf="signupError">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  {{ signupError }}
                </div>
                
                <div class="alert alert-success" *ngIf="signupSuccess">
                  <i class="fas fa-check-circle me-2"></i>
                  {{ signupSuccess }}
                </div>
              </form>
            </div>
            <div class="card-footer text-center bg-light">
              <p class="mb-0">
                Already have an account? 
                <a routerLink="/login" class="text-decoration-none fw-bold">Sign in here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 15px;
      overflow: hidden;
    }
    
    .form-control {
      border-radius: 10px;
      padding: 12px;
    }
    
    .btn {
      border-radius: 10px;
      padding: 12px;
    }
    
    .container-fluid {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .text-success {
      color: #28a745 !important;
    }
    
    .text-danger {
      color: #dc3545 !important;
    }
    
    .text-muted {
      color: #6c757d !important;
    }
  `]
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  signupError = '';
  signupSuccess = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: passwordMatchValidator
    });
  }

  getPasswordRequirementClass(requirement: string): string {
    const passwordControl = this.signupForm.get('password');
    if (!passwordControl?.touched) return 'text-muted';
    
    const hasError = passwordControl.errors?.[requirement];
    return hasError ? 'text-danger' : 'text-success';
  }

  getPasswordRequirementIcon(requirement: string): string {
    const passwordControl = this.signupForm.get('password');
    if (!passwordControl?.touched) return 'fas fa-circle me-1';
    
    const hasError = passwordControl.errors?.[requirement];
    return hasError ? 'fas fa-times me-1' : 'fas fa-check me-1';
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.signupError = '';
      this.signupSuccess = '';
      
      const formData = this.signupForm.value;
      
      // Simulate API call delay
      setTimeout(() => {
        const success = this.authService.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        this.isLoading = false;
        
        if (success) {
          this.signupSuccess = 'Account created successfully! Redirecting to login...';
          
          console.log('=== SIGNUP SUCCESS ===');
          console.log('Name:', formData.name);
          console.log('Email:', formData.email);
          console.log('Signup time:', new Date().toISOString());
          console.log('=====================');
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.signupError = 'User with this email already exists. Please use a different email.';
        }
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }
}