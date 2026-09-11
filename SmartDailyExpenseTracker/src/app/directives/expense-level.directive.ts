import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({ selector: '[appExpenseLevel]', standalone: true })
export class ExpenseLevelDirective implements OnChanges {
  @Input() appExpenseLevel = 0;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  ngOnChanges(): void {
    const color = this.appExpenseLevel <= 100000 ? '#16704b' : this.appExpenseLevel <= 300000 ? '#a85d08' : '#b42318';
    const background = this.appExpenseLevel <= 100000 ? '#e7f7ef' : this.appExpenseLevel <= 300000 ? '#fff3d9' : '#ffe8e5';
    const element = this.elementRef.nativeElement;
    element.style.color = color;
    element.style.backgroundColor = background;
    element.style.fontWeight = '700';
    element.style.borderRadius = '8px';
    element.style.padding = '6px 10px';
    element.style.display = 'inline-block';
  }
}