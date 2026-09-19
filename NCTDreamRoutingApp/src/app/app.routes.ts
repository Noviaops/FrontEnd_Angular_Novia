import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent)
  },
  {
    path: 'members',
    loadComponent: () => import('./pages/members/members').then((m) => m.MembersComponent)
  },
  {
    path: 'albums',
    loadComponent: () => import('./pages/albums/albums').then((m) => m.AlbumsComponent)
  },
  {
    path: 'more',
    loadComponent: () => import('./pages/more/more').then((m) => m.MoreComponent),
    children: [
      {
        path: 'songs',
        loadComponent: () => import('./pages/songs/songs').then((m) => m.SongsComponent)
      },
      {
        path: 'gallery',
        loadComponent: () => import('./pages/gallery/gallery').then((m) => m.GalleryComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundComponent)
  }
];
