import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../types';
import { AuthService } from '../services/auth.service';
import { NicknameService } from '../shared/nickname.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    private authService: AuthService,
    private nicknameService: NicknameService
  ) {}

  user: User | null = null;
  nicknameToShow: string | null = null;

  async ngOnInit() {
    this.user = await this.authService.getCurrentUser();

    if (!this.user) return;

    // Subscribe to nickname updates
    this.nicknameService.nickname$.subscribe({
      next: (nickname) => {
        this.nicknameToShow = nickname;
      },
      error: (err) => console.error('Subscription Error:', err),
    });

    this.nicknameToShow = this.user.nickname;
  }
}
