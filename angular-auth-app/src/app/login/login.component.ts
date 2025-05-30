import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { strongPasswordValidator } from '../password.validator';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <div class="row w-100 justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg border-0">
            <div class="card-header bg-primary text-white text-center py-3">
              <h3 class="mb-0">
                <i class="fas fa-sign-in-alt me-2"></i>Login
              </h3>
            </div>
            <div class="card-body p-4">
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">
                    <i class="fas fa-envelope me-1"></i>Email
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    formControlName="email"
                    placeholder="Enter your email"
                    [ngClass]="{'is-invalid': loginForm.get('email')?.invalid && loginForm.get('email')?.touched}"
                  >
                  <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched">
                    Email is required
                  </div>
                  <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched">
                    Please enter a valid email
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label">
                    <i class="fas fa-lock me-1"></i>Password
                  </label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    formControlName="password"
                    placeholder="Enter your password"
                    [ngClass]="{'is-invalid': loginForm.get('password')?.invalid && loginForm.get('password')?.touched}"
                  >
                  
                  <!-- Password validation messages -->
                  <div class="invalid-feedback d-block" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.errors">
                    <div *ngIf="loginForm.get('password')?.errors?.['required']">
                      Password is required
                    </div>
                    <div *ngIf="loginForm.get('password')?.errors?.['minLength']">
                      • Password must be at least 8 characters long
                    </div>
                    <div *ngIf="loginForm.get('password')?.errors?.['hasUpperCase']">
                      • Password must contain at least one uppercase letter
                    </div>
                    <div *ngIf="loginForm.get('password')?.errors?.['hasLowerCase']">
                      • Password must contain at least one lowercase letter
                    </div>
                    <div *ngIf="loginForm.get('password')?.errors?.['hasNumber']">
                      • Password must contain at least one number
                    </div>
                    <div *ngIf="loginForm.get('password')?.errors?.['hasSpecialChar']">
                      • Password must contain at least one special character (!&#64;#$%^&*)
                    </div>
                  </div>
                </div>
                
                <div class="d-grid gap-2 mb-3">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg"
                    [disabled]="loginForm.invalid || isLoading"
                  >
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="fas fa-sign-in-alt me-2" *ngIf="!isLoading"></i>
                    {{ isLoading ? 'Signing In...' : 'Sign In' }}
                  </button>
                </div>
                
                <div class="alert alert-danger" *ngIf="loginError">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  {{ loginError }}
                </div>
              </form>
            </div>
            <div class="card-footer text-center bg-light">
              <p class="mb-0">
                Don't have an account? 
                <a routerLink="/signup" class="text-decoration-none fw-bold">Sign up here</a>
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
    
    .invalid-feedback {
      font-size: 0.875rem;
    }
    
    .invalid-feedback div {
      margin-bottom: 2px;
      color: #dc3545;
    }
    
    .container-fluid {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator()]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';
      
      const { email, password } = this.loginForm.value;
      
      // Simulate API call delay
      setTimeout(() => {
        const success = this.authService.login(email, password);
        this.isLoading = false;
        
        if (success) {
          console.log('=== LOGIN SUCCESS ===');
          console.log('Email:', email);
          console.log('Login time:', new Date().toISOString());
          console.log('Redirecting to home...');
          console.log('===================');
          
          this.router.navigate(['/home']);
        } else {
          this.loginError = 'Invalid email or password. Please try again.';
          console.log('Login failed for email:', email);
        }
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}