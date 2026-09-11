import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'expenseStatus', standalone: true })
export class ExpenseStatusPipe implements PipeTransform {
  transform(amount: number): string {
    if (amount <= 100000) return 'Hemat';
    return amount <= 300000 ? 'Normal' : 'Besar';
  }
}