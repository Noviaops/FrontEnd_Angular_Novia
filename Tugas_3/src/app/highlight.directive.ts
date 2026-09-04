import { Directive, input, signal } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
  host: {
    '(mouseenter)': 'isHovered.set(true)',
    '(mouseleave)': 'isHovered.set(false)',
    '[style.background-color]': 'isHovered() ? color() : null'
  }
})
export class HighlightDirective {
  readonly color = input('#FFF59D');
  readonly isHovered = signal(false);
}