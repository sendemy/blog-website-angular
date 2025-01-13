import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post, PostPagination, User } from '../../types';
import {
  changeUserData,
  deleteUser,
  getUser,
  getUserPosts,
} from '../../utils/db-utils';
import { AuthService } from '../services/auth.service';
import { NicknameService } from '../shared/nickname.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private nicknameService: NicknameService
  ) {}

  user: User | null = null;
  currentUserProfile: User | null = null;
  userPostsData: PostPagination | null = null;
  userPostsToShow: Post[] = [];

  ownsAccount = false;
  nicknameToDisplay: string | null = null;
  isNicknameChanging = false;
  isPasswordChanging = false;

  changedNickname = new FormControl('', [
    Validators.minLength(2),
    Validators.maxLength(32),
  ]);
  changedPassword = new FormControl('', [
    Validators.minLength(2),
    Validators.maxLength(32),
  ]);
  changedPasswordRepeated = new FormControl('', [
    Validators.minLength(2),
    Validators.maxLength(32),
  ]);

  async ngOnInit() {
    const currentUserProfileId = this.route.snapshot.paramMap.get('id');

    if (!currentUserProfileId) return;

    this.user = await this.authService.getCurrentUser();

    if (!this.user) {
      console.error('No user found.');
      return;
    }

    await getUser(currentUserProfileId).then(
      ([currentUserProfile]: Array<User>) => {
        this.currentUserProfile = currentUserProfile;
        this.handleLoadPosts();
        this.nicknameToDisplay = currentUserProfile.nickname;
      }
    );

    if (this.user?.id === currentUserProfileId) {
      this.ownsAccount = true;
    }
  }

  handlePostRedirect(id: string) {
    this.router.navigate([`/posts/${id}`]);
  }

  async handleLoadPosts() {
    if (this.userPostsData?.next === null) return;

    this.userPostsData = await getUserPosts({
      id: this.currentUserProfile!.id,
      page: this.userPostsData?.next,
    });

    this.userPostsToShow = [
      ...this.userPostsToShow,
      ...this.userPostsData.data,
    ];
  }

  handleChangeNickname(event: Event) {
    event.preventDefault();

    this.isNicknameChanging = !this.isNicknameChanging;

    if (this.changedNickname.invalid) {
      alert('Nickname should be 2 to 32 characters long.');
      return;
    }

    changeUserData(this.user!.id, {
      nickname: this.changedNickname.value as string,
    }).then(() => {
      this.user!.nickname = this.changedNickname.value as string;

      if (this.ownsAccount) {
        this.nicknameToDisplay = this.changedNickname.value;
        this.nicknameService.updateNickname(
          this.changedNickname.value as string
        );
      }
    });
  }

  handleChangePassword(event: Event) {
    event.preventDefault();

    this.isPasswordChanging = !this.isPasswordChanging;

    if (
      this.changedPassword.value !== this.changedPasswordRepeated.value ||
      this.changedPassword.value?.length === null ||
      ((this.changedPassword.value as string).length < 2 &&
        (this.changedPassword.value as string).length > 32) ||
      !this.user?.id
    )
      return;

    changeUserData(this.user.id, {
      password: this.changedPassword.value as string,
    }).then(() => {
      this.user!.password = this.changedPassword.value as string;

      this.changedPassword.reset();
      this.changedPasswordRepeated.reset();
    });
  }

  handleDeleteAccount() {
    if (
      window.confirm(
        'Are you sure you want to delete your account? All of your posts will be deleted permanently.'
      )
    ) {
      deleteUser(this.user!.id).then(() => {
        this.router.navigate(['/register']);
      });
    }
  }

  handleLogOut() {
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
