import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UserControllerService } from './api/api/userController.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY_USER = 'gabescape_username';
  private readonly STORAGE_KEY_CREDS = 'gabescape_credentials';

  constructor(
    private http: HttpClient,
    private userService: UserControllerService
  ) {}

  get isLoggedIn(): boolean {
    return !!sessionStorage.getItem(this.STORAGE_KEY_CREDS);
  }

  get username(): string | null {
    return sessionStorage.getItem(this.STORAGE_KEY_USER);
  }

  get credentials(): string | null {
    return sessionStorage.getItem(this.STORAGE_KEY_CREDS);
  }

  /**
   * Attempt login by making an authenticated request.
   * Since the backend has no /login endpoint, we validate credentials
   * by hitting a lightweight GET endpoint with Basic Auth.
   */
  login(username: string, password: string): Observable<boolean> {
    const creds = btoa(`${username}:${password}`);
    // Use a lightweight endpoint to test credentials
    return this.http
      .get(`http://localhost:8080/post/username/${encodeURIComponent(username)}`, {
        headers: { Authorization: `Basic ${creds}` },
        observe: 'response',
      })
      .pipe(
        map(() => {
          this.storeCredentials(username, creds);
          return true;
        }),
        catchError(() => {
          return throwError(() => new Error('Invalid username or password.'));
        })
      );
  }

  /**
   * Register a new user then auto-login.
   */
  register(
    firstName: string,
    lastName: string,
    username: string,
    password: string
  ): Observable<boolean> {
    return this.userService
      .createUser(firstName, lastName, username, password)
      .pipe(
        map(() => {
          const creds = btoa(`${username}:${password}`);
          this.storeCredentials(username, creds);
          return true;
        }),
        catchError((err) => {
          const message =
            err?.error?.message || err?.error || 'Registration failed. Please try again.';
          return throwError(() => new Error(message));
        })
      );
  }

  logout(): void {
    sessionStorage.removeItem(this.STORAGE_KEY_USER);
    sessionStorage.removeItem(this.STORAGE_KEY_CREDS);
  }

  private storeCredentials(username: string, creds: string): void {
    sessionStorage.setItem(this.STORAGE_KEY_USER, username);
    sessionStorage.setItem(this.STORAGE_KEY_CREDS, creds);
  }
}
