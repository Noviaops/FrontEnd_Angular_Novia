import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home';
import { AboutPage } from './pages/about/about';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'about', component: AboutPage },
  { path: '**', redirectTo: '' },
];