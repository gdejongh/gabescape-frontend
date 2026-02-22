import { Routes } from '@angular/router';
import { PostDetailComponent } from './post-detail/post-detail.component';

export const routes: Routes = [
  { path: 'post/:id', component: PostDetailComponent }
];
