import { Component } from '@angular/core';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.html',
  styleUrl: './songs.css'
})
export class SongsComponent {
  readonly songs = [
    { title: 'Hot Sauce', album: 'Hot Sauce', year: '2021' },
    { title: 'Glitch Mode', album: 'Glitch Mode', year: '2022' },
    { title: 'Beatbox', album: 'Beatbox', year: '2022' },
    { title: 'Favorite', album: 'ISTJ', year: '2023' },
    { title: 'Smoothie', album: 'We Go Up', year: '2018' }
  ];
}
