import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PostControllerService } from '../api/api/postController.service';
import { SubScapeDTO } from '../api/model/subScapeDTO';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent implements OnInit {
  title = '';
  text = '';
  submitting = false;
  error?: string;

  subScapes: SubScapeDTO[] = [];
  selectedSubScape: SubScapeDTO | null = null;
  searchTerm = '';
  showDropdown = false;
  loadingSubScapes = false;

  constructor(
    private postService: PostControllerService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadingSubScapes = true;
    // TODO: Replace with generated SubScapeControllerService.getAllSubScapes() after API client regeneration
    this.http.get<SubScapeDTO[]>('/subscape/').subscribe({
      next: (subScapes) => {
        this.subScapes = subScapes;
        this.loadingSubScapes = false;
      },
      error: (err) => {
        console.error('Failed to load SubScapes:', err);
        this.loadingSubScapes = false;
      },
    });
  }

  get filteredSubScapes(): SubScapeDTO[] {
    if (!this.searchTerm.trim()) {
      return this.subScapes;
    }
    const term = this.searchTerm.toLowerCase();
    return this.subScapes.filter(
      (s) =>
        s.subScapeName?.toLowerCase().includes(term) ||
        s.subScapeDescription?.toLowerCase().includes(term)
    );
  }

  onSearchFocus(): void {
    this.showDropdown = true;
  }

  onSearchBlur(): void {
    // Delay to allow click on dropdown item to register
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  selectSubScape(subScape: SubScapeDTO): void {
    this.selectedSubScape = subScape;
    this.searchTerm = '';
    this.showDropdown = false;
  }

  clearSelection(): void {
    this.selectedSubScape = null;
    this.searchTerm = '';
  }

  onSubmit(): void {
    if (!this.title.trim() || !this.text.trim() || !this.selectedSubScape?.id) {
      this.error = 'Please fill in all fields.';
      return;
    }

    this.submitting = true;
    this.error = undefined;

    this.postService
      .createPost(this.title.trim(), this.text.trim(), this.selectedSubScape.id)
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
