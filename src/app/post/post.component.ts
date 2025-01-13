import { Location, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../types';
import { deletePost, getPost } from '../../utils/db-utils';
import { AuthService } from '../services/auth.service';
import { MarkdownService } from '../services/markdown.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [NgIf],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private markdownService: MarkdownService,
    private authService: AuthService
  ) {}

  post: Post | null = null;
  isPostOwner = false;
  htmlContent: SafeHtml = '';

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.post = (await getPost(id))[0];

    const user = await this.authService.getCurrentUser();

    if (!user) {
      console.error('No user found.');
      return;
    }

    if (this.post.creatorId === user.id) {
      this.isPostOwner = true;
    }

    this.htmlContent = this.markdownService.convertMarkdownToHtml(
      this.post.content
    );
  }

  handlePostEdit() {
    this.router.navigate([`/edit-post/${this.post?.id}`]);
  }

  handlePostDelete() {
    if (window.confirm('Are you sure you want to delete the post?')) {
      deletePost(this.post!.id).then(() => {
        this.router.navigate(['/home']);
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
