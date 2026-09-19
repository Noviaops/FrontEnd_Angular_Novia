import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { GalleryComponent } from '../gallery/gallery';
import { SongsComponent } from '../songs/songs';
import { MoreVisibilityService } from './more-visibility.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-more',
  imports: [SongsComponent, GalleryComponent],
  templateUrl: './more.html',
  styleUrl: './more.css'
})
export class MoreComponent implements OnInit, OnDestroy {
  private navigationSubscription?: Subscription;

  constructor(
    private readonly router: Router,
    readonly visibility: MoreVisibilityService
  ) {}

  ngOnInit(): void {
    this.updateVisibleSections(this.router.url);
    this.navigationSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateVisibleSections(event.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.navigationSubscription?.unsubscribe();
  }

  private updateVisibleSections(url: string): void {
    if (url.includes('/more/songs')) {
      this.visibility.revealSongs();
    }

    if (url.includes('/more/gallery')) {
      this.visibility.revealGallery();
    }

    if (url.endsWith('/more') || url.endsWith('/more/')) {
      this.visibility.reset();
    }
  }
}
