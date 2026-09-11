import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Expense } from './models/expense.model';
import { CategoryNamePipe } from './pipes/category-name.pipe';
import { ExpenseStatusPipe } from './pipes/expense-status.pipe';
import { RupiahPipe } from './pipes/rupiah.pipe';
import { ExpenseLevelDirective } from './directives/expense-level.directive';

@Component({
  selector: 'app-root', standalone: true,
  imports: [FormsModule, RupiahPipe, CategoryNamePipe, ExpenseStatusPipe, ExpenseLevelDirective],
  templateUrl: './app.component.html', styleUrl: './app.component.css'
})
export class AppComponent {
  expenses: Expense[] = [
    { id: 1, title: 'Sarapan Pagi', category: 'food', amount: 35000, date: '2026-09-01' },
    { id: 2, title: 'Ongkos Kuliah', category: 'transportation', amount: 75000, date: '2026-09-02' },
    { id: 3, title: 'Beli Buku Pemrograman', category: 'education', amount: 185000, date: '2026-09-02' },
    { id: 4, title: 'Belanja Bulanan', category: 'shopping', amount: 450000, date: '2026-09-03' },
    { id: 5, title: 'Langganan Internet', category: 'bills', amount: 325000, date: '2026-09-04' },
    { id: 6, title: 'Nonton Film', category: 'entertainment', amount: 120000, date: '2026-09-05' }
  ];
  newExpense: Expense = this.emptyExpense();
  formSubmitted = false;

  get totalExpense(): number { return this.expenses.reduce((total, item) => total + item.amount, 0); }
  get largestExpense(): number { return this.expenses.reduce((largest, item) => Math.max(largest, item.amount), 0); }

  addExpense(): void {
    this.formSubmitted = true;
    if (!this.isFormValid()) return;
    const id = this.expenses.reduce((largest, item) => Math.max(largest, item.id), 0) + 1;
    this.expenses = [...this.expenses, { ...this.newExpense, id, amount: Number(this.newExpense.amount) }];
    this.resetForm();
  }

  deleteExpense(id: number): void { this.expenses = this.expenses.filter((item) => item.id !== id); }
  resetForm(): void { this.newExpense = this.emptyExpense(); this.formSubmitted = false; }
  isFormValid(): boolean {
    return Boolean(this.newExpense.title.trim() && this.newExpense.category && this.newExpense.amount > 0 && this.newExpense.date);
  }
  private emptyExpense(): Expense { return { id: 0, title: '', category: '', amount: 0, date: '' }; }
}