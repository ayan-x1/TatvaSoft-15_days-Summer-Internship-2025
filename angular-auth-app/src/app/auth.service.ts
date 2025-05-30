import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  signup(userData: { name: string; email: string; password: string }): boolean {
    try {
      // Store user data (in real app, this would be sent to backend)
      const users = this.getStoredUsers();
      
      // Check if user already exists
      if (users.find(u => u.email === userData.email)) {
        return false; // User already exists
      }
      
      users.push({
        name: userData.name,
        email: userData.email,
        password: userData.password // In real app, this would be hashed
      });
      
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  }

  login(email: string, password: string): boolean {
    try {
      const users = this.getStoredUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        const currentUser: User = { name: user.name, email: user.email };
        this.currentUserSubject.next(currentUser);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getStoredUsers(): any[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }
}