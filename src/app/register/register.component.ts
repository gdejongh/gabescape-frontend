import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  username = '';
  password = '';
  submitting = false;
  error?: string;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    if (
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.username.trim() ||
      !this.password.trim()
    ) {
      this.error = 'Please fill in all fields.';
      return;
    }

    this.submitting = true;
    this.error = undefined;

    this.auth
      .register(
        this.firstName.trim(),
        this.lastName.trim(),
        this.username.trim(),
        this.password
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.error = err.message;
          this.submitting = false;
        },
      });
  }
}
