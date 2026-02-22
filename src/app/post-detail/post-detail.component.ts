import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { PostControllerService } from '../api/api/postController.service';
import { CommentControllerService } from '../api/api/commentController.service';
import { PostDTO } from '../api/model/postDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
})
export class PostDetailComponent implements OnInit {
  post?: PostDTO;
  loading = true;
  error?: string;

  // Comment reply state
  replyingTo: number | null = null; // null = top-level, number = parent comment id
  replyText = '';
  submittingReply = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostControllerService,
    private commentService: CommentControllerService,
    private cdr: ChangeDetectorRef,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.loadPost(Number(idParam));
    }
  }

  private loadPost(id: number): void {
    this.postService.getAllPostAndCommentsByPostId(id).subscribe({
      next: (data: any) => {
        this.post = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('API Error:', err);
        if (err.status === 401) {
          this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
        } else {
          this.error = 'Failed to load post.';
        }
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openReply(commentId: number | null): void {
    this.replyingTo = commentId;
    this.replyText = '';
  }

  cancelReply(): void {
    this.replyingTo = null;
    this.replyText = '';
  }

  submitReply(): void {
    if (!this.replyText.trim() || !this.post?.id) return;

    this.submittingReply = true;
    const parentId = this.replyingTo ?? undefined;

    this.commentService
      .createComment(this.post.id, { text: this.replyText.trim() }, parentId)
      .subscribe({
        next: () => {
          this.replyingTo = null;
          this.replyText = '';
          this.submittingReply = false;
          // Reload the post to get updated comments
          this.loadPost(this.post!.id!);
        },
        error: (err) => {
          console.error('Failed to post comment:', err);
          this.submittingReply = false;
          this.cdr.detectChanges();
        },
      });
  }
}