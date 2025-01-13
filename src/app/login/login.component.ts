import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private router: Router, private authService: AuthService) {}

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(64),
  ]);

  async handleLogin(event: Event) {
    event.preventDefault();

    if (this.email.invalid) {
      alert('Invalid email.');
      return;
    }

    if (this.password.invalid) {
      alert('Password must be between 2 and 64 characters long.');
      return;
    }

    const token = await this.authService.login(
      this.email.value!,
      this.password.value!
    );

    if (!token) {
      alert('Invalid email or password');
      return;
    }

    sessionStorage.setItem('authToken', token);
    this.router.navigate(['/home']);
  }
}
