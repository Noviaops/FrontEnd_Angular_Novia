import { Component, Input } from '@angular/core';
import { Member } from '../../models/member.model';

@Component({
  selector: 'app-member-card',
  standalone: true,
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent {
  @Input() member!: Member;
}
