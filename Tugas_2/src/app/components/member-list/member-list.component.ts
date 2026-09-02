import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../models/member.model';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, MemberCardComponent],
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent {
  members: Member[] = [
    { name: 'Mark Lee', image: '/assets/images/mark.jpg', role: 'Leader, Rapper', birth: '2 August 1999' },
    { name: 'Huang Renjun', image: '/assets/images/renjun.jpg', role: 'Vocal', birth: '23 March 2000' },
    { name: 'Lee Jeno', image: '/assets/images/jeno.jpg', role: 'Rapper, Dancer', birth: '23 April 2000' },
    { name: 'Lee Haechan', image: '/assets/images/haechan.jpg', role: 'Vocal', birth: '6 June 2000' },
    { name: 'Na Jaemin', image: '/assets/images/jaemin.jpg', role: 'Rapper, Dancer', birth: '13 August 2000' },
    { name: 'Zhong Chenle', image: '/assets/images/chenle.jpg', role: 'Vocal', birth: '22 November 2001' },
    { name: 'Park Jisung', image: '/assets/images/jisung.jpg', role: 'Dancer, Vocal', birth: '5 February 2002' }
  ];
}
