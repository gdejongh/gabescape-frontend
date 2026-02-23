import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SubScapeControllerService } from '../api/api/subScapeController.service';
import { SubScape } from '../api/model/subScape';

@Component({
  selector: 'app-create-subscape',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-subscape.component.html',
  styleUrl: './create-subscape.component.css',
})
export class CreateSubScapeComponent {
  name = '';
  description = '';
  submitting = false;
  error?: string;

  constructor(
    private subScapeService: SubScapeControllerService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.name.trim()) {
      this.error = 'Please enter a SubScape name.';
      return;
    }

    this.submitting = true;
    this.error = undefined;

    this.subScapeService
      .createSubScape({
        subScapeName: this.name.trim(),
        subScapeDescription: this.description.trim() || undefined,
      })
      .subscribe({
        next: (subScape) => {
          this.router.navigate(['/s', (subScape as SubScape).subScapeName]);
        },
        error: (err) => {
          console.error('Failed to create SubScape:', err);
          if (err.status === 409) {
            this.error = 'A SubScape with that name already exists.';
          } else {
            this.error = 'Failed to create SubScape. Please try again.';
          }
          this.submitting = false;
        },
      });
  }
}
