import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { AboutComponent } from './components/about/about.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MemberListComponent, GalleryComponent, AboutComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('nctdream-profile');
}
