import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { Post, User } from '../../types';
import { getUser } from '../../utils/db-utils';
import { MarkdownService } from '../services/markdown.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent {
  constructor(
    private router: Router,
    private markdownService: MarkdownService
  ) {}

  @Input() post!: Post;
  creator: User | null = null;
  htmlContent: SafeHtml = '';

  async ngOnInit() {
    this.creator = (await getUser(this.post.creatorId))[0];

    this.htmlContent = this.markdownService.convertMarkdownToHtml(
      this.post.content
    );
  }

  goToPost(postId: string) {
    this.router.navigate([`/posts/${postId}`]);
  }
}
