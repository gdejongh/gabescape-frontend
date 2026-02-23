import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PostControllerService } from '../api/api/postController.service';
import { SubScapeControllerService } from '../api/api/subScapeController.service';
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

  // Inline SubScape creation
  showInlineCreate = false;
  newSubScapeName = '';
  newSubScapeDesc = '';
  creatingSub = false;
  createSubError?: string;

  constructor(
    private postService: PostControllerService,
    private subScapeService: SubScapeControllerService,
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
    // Don't close the dropdown if the inline create form is open
    setTimeout(() => {
      if (!this.showInlineCreate) {
        this.showDropdown = false;
      }
    }, 200);
  }

  startInlineCreate(): void {
    this.newSubScapeName = this.searchTerm.trim();
    this.newSubScapeDesc = '';
    this.createSubError = undefined;
    this.showInlineCreate = true;
    this.showDropdown = true;
  }

  cancelInlineCreate(): void {
    this.showInlineCreate = false;
    this.createSubError = undefined;
    this.newSubScapeName = '';
    this.newSubScapeDesc = '';
  }

  submitInlineSubScape(): void {
    if (!this.newSubScapeName.trim()) {
      this.createSubError = 'Please enter a name.';
      return;
    }
    this.creatingSub = true;
    this.createSubError = undefined;
    this.subScapeService
      .createSubScape({
        subScapeName: this.newSubScapeName.trim(),
        subScapeDescription: this.newSubScapeDesc.trim() || undefined,
      })
      .subscribe({
        next: (created) => {
          this.subScapes = [...this.subScapes, created];
          this.creatingSub = false;
          this.showInlineCreate = false;
          this.selectSubScape(created);
        },
        error: (err) => {
          this.creatingSub = false;
          if (err.status === 409) {
            this.createSubError = 'A SubScape with that name already exists.';
          } else {
            this.createSubError = 'Failed to create SubScape. Please try again.';
          }
        },
      });
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
