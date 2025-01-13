import { Component } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink, RouterModule } from '@angular/router'
import { dbHasUser } from '../../utils/db-utils'
import { AuthService } from '../services/auth.service'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private router: Router, private authService: AuthService) {}

  nickname = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(32),
  ]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(64),
  ]);
  passwordRepeat = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(64),
  ]);

  async onSubmit(event: Event) {
    event.preventDefault();

    if (this.nickname.invalid) {
      alert('Nickname must be between 2 and 32 characters long.');
      return;
    }

    if (this.email.invalid) {
      alert('Invalid email.');
      return;
    }

    const hasUser = await dbHasUser(this.email.value as string);

    if (hasUser) {
      alert('The user with this email is already registered');
      return;
    }

    if (this.password.invalid) {
      alert('Password must be between 2 and 64 characters long.');
      return;
    } else if (this.password.value !== this.passwordRepeat.value) {
      alert('Passwords are not matching.');
      return;
    }

    this.authService
      .register({
        email: this.email.value!,
        password: this.password.value!,
        nickname: this.nickname.value!,
        role: 'user',
      })
      .then((token) => {
        if (!token) {
          console.error('Unable to get token');
          return;
        }

        sessionStorage.setItem('authToken', token);

        this.router.navigate(['/home']);
      });
  }
}
