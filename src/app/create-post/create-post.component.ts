import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostFormComponent } from '../post-form/post-form.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [PostFormComponent],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss',
})
export class CreatePostComponent {
  constructor(private router: Router, private authService: AuthService) {}

  buttonText = 'Create post';

  async ngOnInit() {
    const user = await this.authService.getCurrentUser();

    if (user?.role !== 'admin') {
      this.router.navigate(['/home']);
    }
  }
}
