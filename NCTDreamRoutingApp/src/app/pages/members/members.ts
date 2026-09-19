import { Component } from '@angular/core';

@Component({
  selector: 'app-members',
  templateUrl: './members.html',
  styleUrl: './members.css'
})
export class MembersComponent {
  readonly members = [
    { name: 'Mark', role: 'Leader • Vocal & Dance', info: 'Bright and energetic performer.' },
    { name: 'Renjun', role: 'Vocal • Main Vocalist', info: 'Soft voice with strong emotional expression.' },
    { name: 'Jeno', role: 'Dance • Main Dancer', info: 'Charismatic dance energy and charm.' },
    { name: 'Haechan', role: 'Vocal • Main Vocalist', info: 'Dynamic voice with standout stage presence.' },
    { name: 'Jaemin', role: 'Dance • Lead Dancer', info: 'Smooth moves and stylish performance.' },
    { name: 'Chenle', role: 'Vocal • Rapper', info: 'Strong vocals with a playful personality.' },
    { name: 'Jisung', role: 'Rapper • Lead Rapper', info: 'Fast rap flow and youthful charisma.' }
  ];
}
