import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { SubScapeDetailComponent } from './subscape-detail/subscape-detail.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'post/:id', component: PostDetailComponent },
  { path: 's/:name', component: SubScapeDetailComponent },
  { path: 'create-post', component: CreatePostComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: NotFoundComponent },
];
