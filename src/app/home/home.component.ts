import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostControllerService } from '../api/api/postController.service';
import { PostDTO } from '../api/model/postDTO';
import { PostCardComponent } from '../post-card/post-card.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PostCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  posts: PostDTO[] = [];
  loading = true;
  error?: string;
  requiresLogin = false;

  constructor(private postService: PostControllerService, public auth: AuthService) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn) {
      this.loading = false;
      this.requiresLogin = true;
      return;
    }

    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
        if (err.status === 401) {
          this.requiresLogin = true;
        } else {
          this.error = 'Failed to load posts.';
        }
        this.loading = false;
      },
    });
  }
}
