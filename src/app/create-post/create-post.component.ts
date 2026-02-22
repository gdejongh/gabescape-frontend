import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PostControllerService } from '../api/api/postController.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent {
  title = '';
  text = '';
  subScapeId: number | null = null;
  submitting = false;
  error?: string;

  constructor(
    private postService: PostControllerService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.title.trim() || !this.text.trim() || !this.subScapeId) {
      this.error = 'Please fill in all fields.';
      return;
    }

    this.submitting = true;
    this.error = undefined;

    this.postService
      .createPost(this.title.trim(), this.text.trim(), this.subScapeId)
      .subscribe({
        next: (post) => {
          this.router.navigate(['/post', post.id]);
        },
        error: (err) => {
          console.error('Failed to create post:', err);
          this.error = 'Failed to create post. Please try again.';
          this.submitting = false;
        },
      });
  }
}
