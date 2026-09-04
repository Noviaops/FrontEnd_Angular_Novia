import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'initials', standalone: true, pure: true })
export class InitialsPipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 2): string {
    if (!value?.trim()) return '';
    return value.trim().split(/\s+/).slice(0, Math.max(0, limit)).map((word) => word[0].toUpperCase()).join('');
  }
}