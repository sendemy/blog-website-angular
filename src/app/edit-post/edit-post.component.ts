import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../types';
import { getPost } from '../../utils/db-utils';
import { PostFormComponent } from '../post-form/post-form.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [PostFormComponent, NgIf],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss',
})
export class EditPostComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  buttonText = 'Save edits';
  post: Post | null = null;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    const post = (await getPost(id))[0];

    const user = await this.authService.getCurrentUser();

    if (user?.id !== post.creatorId) {
      this.router.navigate(['/home']);
      return;
    }

    this.post = post;
  }
}
