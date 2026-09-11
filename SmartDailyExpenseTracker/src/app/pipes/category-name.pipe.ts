import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'categoryName', standalone: true })
export class CategoryNamePipe implements PipeTransform {
  private readonly categories: Record<string, string> = {
    food: 'Makanan', transportation: 'Transportasi', shopping: 'Belanja',
    entertainment: 'Hiburan', bills: 'Tagihan', education: 'Pendidikan'
  };

  transform(value: string): string {
    return this.categories[value] ?? 'Lainnya';
  }
}