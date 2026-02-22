import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostControllerService } from '../api/api/postController.service';
import { PostDTO } from '../api/model/postDTO';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-detail.component.html',
})
export class PostDetailComponent implements OnInit {
  post?: PostDTO;
  loading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private postService: PostControllerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.postService.getAllPostAndCommentsByPostId(Number(idParam)).subscribe({
        next: async (data: any) => {
          this.post = data; // It will be a real object now!
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error("API Error:", err);
          this.error = 'Failed to load post.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}