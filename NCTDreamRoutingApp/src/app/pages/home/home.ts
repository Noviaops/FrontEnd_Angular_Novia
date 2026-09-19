import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  readonly stats = [
    { label: 'Members', value: '7' },
    { label: 'Albums', value: 'Beberapa album' },
    { label: 'Songs', value: 'Beberapa lagu' }
  ];

  readonly quickCards = [
    { title: 'Members', text: '7 members with different personalities and energy.' },
    { title: 'Albums', text: 'A rich discography with colorful concepts.' },
    { title: 'Favorite Song', text: 'The energy and charm that make NCT DREAM shine.' }
  ];
}
