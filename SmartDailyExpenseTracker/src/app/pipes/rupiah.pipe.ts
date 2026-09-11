import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'rupiah', standalone: true })
export class RupiahPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return `Rp ${(value ?? 0).toLocaleString('id-ID')}`;
  }
}