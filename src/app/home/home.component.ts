import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Post, PostPagination, User } from '../../types';
import { getPosts } from '../../utils/db-utils';
import { PostCardComponent } from '../post-card/post-card.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, PostCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  postsData: PostPagination | null = null;
  postsToShow: Post[] = [];
  user: User | null = null;

  async ngOnInit() {
    this.user = await this.authService.getCurrentUser();

    this.handleLoadPosts();
  }

  async handleLoadPosts() {
    if (this.postsData?.next === null) return;

    this.postsData = await getPosts(this.postsData?.next);

    this.postsToShow = [...this.postsToShow, ...this.postsData.data];
  }
}
