import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid vh-100" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <!-- Navigation Bar -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow">
        <div class="container">
          <a class="navbar-brand" href="#">
            <i class="fas fa-home me-2"></i>My App
          </a>
          <div class="navbar-nav ms-auto">
            <span class="navbar-text me-3" *ngIf="currentUser">
              <i class="fas fa-user me-1"></i>Welcome, {{ currentUser.name }}!
            </span>
            <button class="btn btn-outline-light btn-sm" (click)="logout()">
              <i class="fas fa-sign-out-alt me-1"></i>Logout
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="container mt-5">
        <div class="row">
          <div class="col-12">
            <!-- Welcome Card -->
            <div class="card shadow-lg border-0 mb-4">
              <div class="card-header bg-primary text-white py-3">
                <h3 class="mb-0 text-center">
                  <i class="fas fa-home me-2"></i>Dashboard Home
                </h3>
              </div>
              <div class="card-body p-4">
                <div class="alert alert-success" role="alert">
                  <h4 class="alert-heading">
                    <i class="fas fa-check-circle me-2"></i>Welcome Back!
                  </h4>
                  <p>Hi <strong>{{ currentUser?.name }}</strong>, you have successfully logged in to your secure dashboard.</p>
                  <hr>
                  <p class="mb-0">
                    <i class="fas fa-envelope me-2"></i>Email: {{ currentUser?.email }}<br>
                    <i class="fas fa-clock me-2"></i>Last login: {{ currentTime }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Feature Cards -->
            <div class="row">
              <div class="col-md-4 mb-4">
                <div class="card border-0 shadow h-100 feature-card">
                  <div class="card-body text-center">
                    <div class="feature-icon bg-info text-white mb-3">
                      <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <h5 class="card-title text-info">Dashboard</h5>
                    <p class="card-text">View your personal dashboard with real-time analytics and insights.</p>
                    <button class="btn btn-info btn-sm" (click)="navigateToFeature('dashboard')">
                      <i class="fas fa-arrow-right me-1"></i>Go to Dashboard
                    </button>
                  </div>
                </div>
              </div>

              <div class="col-md-4 mb-4">
                <div class="card border-0 shadow h-100 feature-card">
                  <div class="card-body text-center">
                    <div class="feature-icon bg-success text-white mb-3">
                      <i class="fas fa-cog"></i>
                    </div>
                    <h5 class="card-title text-success">Settings</h5>
                    <p class="card-text">Manage your account settings, preferences, and security options.</p>
                    <button class="btn btn-success btn-sm" (click)="navigateToFeature('settings')">
                      <i class="fas fa-arrow-right me-1"></i>Account Settings
                    </button>
                  </div>
                </div>
              </div>

              <div class="col-md-4 mb-4">
                <div class="card border-0 shadow h-100 feature-card">
                  <div class="card-body text-center">
                    <div class="feature-icon bg-warning text-white mb-3">
                      <i class="fas fa-chart-bar"></i>
                    </div>
                    <h5 class="card-title text-warning">Analytics</h5>
                    <p class="card-text">View detailed reports and analytics for your account activity.</p>
                    <button class="btn btn-warning btn-sm" (click)="navigateToFeature('analytics')">
                      <i class="fas fa-arrow-right me-1"></i>View Analytics
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="row mt-4">
              <div class="col-12">
                <div class="card border-0 shadow">
                  <div class="card-header bg-secondary text-white">
                    <h5 class="mb-0">
                      <i class="fas fa-bolt me-2"></i>Quick Actions
                    </h5>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-3 mb-2">
                        <button class="btn btn-outline-primary w-100" (click)="quickAction('profile')">
                          <i class="fas fa-user me-2"></i>Edit Profile
                        </button>
                      </div>
                      <div class="col-md-3 mb-2">
                        <button class="btn btn-outline-secondary w-100" (click)="quickAction('password')">
                          <i class="fas fa-key me-2"></i>Change Password
                        </button>
                      </div>
                      <div class="col-md-3 mb-2">
                        <button class="btn btn-outline-info w-100" (click)="quickAction('notifications')">
                          <i class="fas fa-bell me-2"></i>Notifications
                        </button>
                      </div>
                      <div class="col-md-3 mb-2">
                        <button class="btn btn-outline-success w-100" (click)="quickAction('help')">
                          <i class="fas fa-question-circle me-2"></i>Help & Support
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .feature-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border-radius: 15px;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .feature-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-size: 1.5rem;
    }
    
    .card {
      border-radius: 15px;
      overflow: hidden;
    }
    
    .btn {
      border-radius: 10px;
      transition: all 0.3s ease;
    }
    
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    .navbar-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .alert {
      border-radius: 15px;
    }
  `]
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  currentTime: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.currentTime = new Date().toLocaleString();
  }

  logout() {
    console.log('=== LOGOUT ACTION ===');
    console.log('User:', this.currentUser?.name);
    console.log('Logout time:', new Date().toISOString());
    console.log('Redirecting to login page...');
    console.log('====================');
    
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToFeature(feature: string) {
    console.log(`Navigating to ${feature} feature`);
    // In a real app, you would navigate to the actual feature page
    alert(`${feature.charAt(0).toUpperCase() + feature.slice(1)} feature coming soon!`);
  }

  quickAction(action: string) {
    console.log(`Quick action triggered: ${action}`);
    // In a real app, you would implement these actions
    alert(`${action.charAt(0).toUpperCase() + action.slice(1)} action triggered!`);
  }
}