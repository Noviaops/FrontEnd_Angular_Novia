import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-gallery',
  standalone: true,
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy {
  images = [
    '/assets/images/mark.jpg',
    '/assets/images/renjun.jpg',
    '/assets/images/jeno.jpg',
    '/assets/images/haechan.jpg',
    '/assets/images/jaemin.jpg',
    '/assets/images/chenle.jpg',
    '/assets/images/jisung.jpg',
    '/assets/images/nctdream.jpg'
  ];
  currentSlide = 0;
  private intervalId: any = null;

  ngOnInit(): void {
    this.intervalId = setInterval(() => this.nextSlide(), 3000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }

  previousSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}
