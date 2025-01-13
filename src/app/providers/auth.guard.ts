import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
      // No token found, redirect to login
      this.router.navigate(['/login']);
      return false;
    }

    // Token exists, allow access
    return true;
  }
}
