import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostControllerService } from '../api/api/postController.service';
import { PostDTO } from '../api/model/postDTO';
import { PostCardComponent } from '../post-card/post-card.component';

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

  constructor(private postService: PostControllerService) {}

  ngOnInit(): void {
    // Using getAllPostsByUsername since there's no "get all" endpoint yet.
    // The auth is hardcoded to gdejongh.
    this.postService.getAllPostsByUsername('gdejongh').subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
        this.error = 'Failed to load posts.';
        this.loading = false;
      },
    });
  }
}
