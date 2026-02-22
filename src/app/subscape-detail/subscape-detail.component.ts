import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { SubScapeControllerService } from '../api/api/subScapeController.service';
import { PostControllerService } from '../api/api/postController.service';
import { SubScapeDTO } from '../api/model/subScapeDTO';
import { PostDTO } from '../api/model/postDTO';
import { PostCardComponent } from '../post-card/post-card.component';

@Component({
  selector: 'app-subscape-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, PostCardComponent],
  templateUrl: './subscape-detail.component.html',
  styleUrl: './subscape-detail.component.css',
})
export class SubScapeDetailComponent implements OnInit {
  subscape?: SubScapeDTO;
  posts: PostDTO[] = [];
  loading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subScapeService: SubScapeControllerService,
    private postService: PostControllerService
  ) {}

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (!name) {
      this.error = 'SubScape not found.';
      this.loading = false;
      return;
    }

    this.subScapeService.getSubScapeByName(name).subscribe({
      next: (data) => {
        this.subscape = data;
        this.loadPosts(name);
      },
      error: (err) => {
        if (err.status === 401) {
          this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
        } else {
          this.error = 'Failed to load SubScape.';
        }
        this.loading = false;
      },
    });
  }

  private loadPosts(name: string): void {
    this.postService.getAllPostsBySubScapeName(name).subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 401) {
          this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
        } else {
          this.error = 'Failed to load posts.';
        }
        this.loading = false;
      },
    });
  }
}
