import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class GalleryComponent {
  readonly galleryItems = [
    'NCT DREAM',
    'Mark',
    'Renjun',
    'Jeno',
    'Haechan',
    'Jaemin',
    'Chenle',
    'Jisung'
  ];
}
