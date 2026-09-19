import { Component } from '@angular/core';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.html',
  styleUrl: './albums.css'
})
export class AlbumsComponent {
  readonly albums = [
    { title: 'We Go Up', year: '2018', description: 'Bright and exciting debut era with youthful energy.' },
    { title: 'Reload', year: '2020', description: 'A fresh comeback with smooth and catchy tracks.' },
    { title: 'Glitch Mode', year: '2022', description: 'A more mature sound with emotional storytelling.' },
    { title: 'ISTJ', year: '2023', description: 'A refined concept highlighting strong group identity.' }
  ];
}
