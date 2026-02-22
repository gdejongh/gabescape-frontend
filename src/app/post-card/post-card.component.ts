import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostDTO } from '../api/model/postDTO';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent {
  @Input({ required: true }) post!: PostDTO;
}
