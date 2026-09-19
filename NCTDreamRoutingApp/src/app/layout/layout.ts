import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent {
  readonly mainMenus = [
    { label: 'Home', icon: '🏠', path: '/home' },
    { label: 'Members', icon: '👥', path: '/members' },
    { label: 'Albums', icon: '💿', path: '/albums' },
    { label: 'More', icon: '⋯', path: '/more' }
  ];

  readonly moreMenus = [
    { label: 'Songs', icon: '♪', path: '/more/songs' },
    { label: 'Gallery', icon: '▣', path: '/more/gallery' }
  ];
}
