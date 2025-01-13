import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { Post, User } from '../../types';
import { createPost, updatePost } from '../../utils/db-utils';
import { AuthService } from '../services/auth.service';

interface PostInForm {
  title: FormControl;
  content: string;
  category: FormControl;
  previewImage: string | ArrayBuffer | null;
  creatorId: string | null;
}

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [ReactiveFormsModule, LMarkdownEditorModule, FormsModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss',
})
export class PostFormComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  @Input() formType!: string;
  @Input() postContent?: Post | null;

  post: PostInForm = {
    title: new FormControl(''),
    content: '',
    category: new FormControl(''),
    previewImage: null,
    creatorId: null,
  };

  mode = 'editor';
  options = {
    showPreviewPanel: true,
    showBorder: true,
    usingFontAwesome5: false,
    scrollPastEnd: 0,
    enablePreviewContentClick: false,
    resizable: false,
    placeholder: 'Start typing...',
  };

  ngOnInit() {
    this.post.category.setValue('other');

    if (this.postContent) {
      this.post.title.setValue(this.postContent.title);
      this.post.content = this.postContent.content;
      this.post.category.setValue(this.postContent.category);
      this.post.previewImage = this.postContent.previewImage;
    }
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    const user: User | null = await this.authService.getCurrentUser();

    if (!user) {
      console.error('No user found.');
      return;
    }

    const post: PostInForm = {
      title: this.post.title.value,
      content: this.post.content,
      category: this.post.category.value,
      previewImage: this.post.previewImage,
      creatorId: user.id,
    };

    if (this.formType === 'edit') {
      const id = this.route.snapshot.paramMap.get('id');

      updatePost(id!, JSON.stringify(post)).then(() => {
        this.router.navigate(['/home']);
      });
    } else {
      createPost(JSON.stringify(post));
      this.router.navigate(['/home']);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.post.previewImage = reader.result;
        console.log(this.post.previewImage);
      };

      reader.readAsDataURL(file);
    }
  }
}
