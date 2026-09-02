import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from '../../components/contact/contact';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ContactComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomePage {}
