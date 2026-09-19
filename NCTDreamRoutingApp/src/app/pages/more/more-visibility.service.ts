import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MoreVisibilityService {
  showSongs = false;
  showGallery = false;

  reset(): void {
    this.showSongs = false;
    this.showGallery = false;
  }

  revealSongs(): void {
    this.showSongs = true;
  }

  revealGallery(): void {
    this.showGallery = true;
  }
}
