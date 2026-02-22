import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { SubScapeControllerService } from '../api/api/subScapeController.service';
import { SubScapeDTO } from '../api/model/subScapeDTO';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  searchQuery = '';
  searchResults: SubScapeDTO[] = [];
  showResults = false;
  searching = false;
  private searchSubject = new Subject<string>();

  @ViewChild('searchContainer') searchContainer!: ElementRef;
  @ViewChild('createMenuContainer') createMenuContainer!: ElementRef;

  showCreateMenu = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    private subScapeService: SubScapeControllerService
  ) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query.trim()) {
            this.searching = false;
            return of([]);
          }
          this.searching = true;
          return this.subScapeService.searchSubScapes(query).pipe(
            catchError(() => of([]))
          );
        })
      )
      .subscribe((results) => {
        this.searchResults = results;
        this.searching = false;
        this.showResults = true;
      });
  }

  get avatarLetter(): string {
    return (this.auth.username || '?')[0].toUpperCase();
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      this.showResults = false;
    }
  }

  goToSubScape(name: string | undefined): void {
    if (!name) return;
    this.router.navigate(['/s', name]);
    this.clearSearch();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.showResults = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (this.searchContainer && !this.searchContainer.nativeElement.contains(event.target)) {
      this.showResults = false;
    }
    if (this.createMenuContainer && !this.createMenuContainer.nativeElement.contains(event.target)) {
      this.showCreateMenu = false;
    }
  }

  toggleCreateMenu(): void {
    this.showCreateMenu = !this.showCreateMenu;
  }

  selectCreateOption(): void {
    this.showCreateMenu = false;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
