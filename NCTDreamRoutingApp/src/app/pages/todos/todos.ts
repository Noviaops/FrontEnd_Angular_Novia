import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo, TodoService } from '../../services/todo.service';

type TodoStatusFilter = 'all' | 'completed' | 'pending';
type TodoSortOrder = 'newest' | 'oldest';

@Component({
  selector: 'app-todos',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './todos.html',
  styleUrl: './todos.css'
})
export class TodosComponent {
  readonly todoForm: FormGroup;
  todos: Todo[] = [];
  searchTerm = '';
  statusFilter: TodoStatusFilter = 'all';
  sortOrder: TodoSortOrder = 'newest';
  isLoading = false;
  isSubmitting = false;
  isEditMode = false;
  selectedTodoId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly todoService: TodoService,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    this.todoForm = this.fb.group({
      userId: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      completed: [false]
    });

    this.loadTodos();
  }

  loadTodos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.todoService
      .getTodos()
      .subscribe({
        next: (todos) => {
          this.todos = [...todos];
          this.isLoading = false;
          this.changeDetector.markForCheck();
        },
        error: (error: Error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Data gagal dimuat.';
          this.changeDetector.markForCheck();
        }
      });
  }

  onSubmit(): void {
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      this.errorMessage = 'Mohon lengkapi form dengan benar sebelum submit.';
      return;
    }

    const payload = {
      ...this.todoForm.value,
      userId: Number(this.todoForm.value.userId)
    };

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const request$ =
      this.isEditMode && this.selectedTodoId !== null
        ? this.todoService.updateTodo(this.selectedTodoId, payload)
        : this.todoService.createTodo(payload);

    request$.subscribe({
      next: (todo) => {
        this.isSubmitting = false;
        this.successMessage = this.isEditMode
          ? `Todo #${todo.id} berhasil diperbarui.`
          : 'Todo berhasil ditambahkan.';

        this.resetForm();
        this.changeDetector.markForCheck();
        this.loadTodos();
      },
      error: (error: Error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Terjadi kesalahan saat menyimpan data.';
        this.changeDetector.markForCheck();
      }
    });
  }

  editTodo(todo: Todo): void {
    this.isEditMode = true;
    this.selectedTodoId = todo.id;
    this.todoForm.patchValue({
      userId: todo.userId,
      title: todo.title,
      completed: todo.completed
    });
    this.successMessage = `Mengedit Todo #${todo.id}`;
    this.errorMessage = '';
    this.scrollToForm();
  }

  deleteTodo(todo: Todo): void {
    const confirmed = window.confirm(`Hapus Todo "${todo.title}"?`);

    if (!confirmed) {
      return;
    }

    this.todoService.deleteTodo(todo.id).subscribe({
      next: () => {
        this.successMessage = `Todo #${todo.id} berhasil dihapus.`;

        if (this.selectedTodoId === todo.id) {
          this.resetForm();
        }

        this.changeDetector.markForCheck();
        this.loadTodos();
      },
      error: (error: Error) => {
        this.errorMessage = error.message || 'Todo gagal dihapus.';
        this.changeDetector.markForCheck();
      }
    });
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedTodoId = null;
    this.todoForm.reset({
      userId: null,
      title: '',
      completed: false
    });
  }

  openCreateForm(): void {
    this.resetForm();
    this.successMessage = '';
    this.errorMessage = '';
    this.scrollToForm();
  }

  private scrollToForm(): void {
    const formElement = document.getElementById('todo-form');

    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  get titleControl() {
    return this.todoForm.get('title');
  }

  get userIdControl() {
    return this.todoForm.get('userId');
  }

  get filteredTodos(): Todo[] {
    const searchTerm = this.searchTerm.trim().toLocaleLowerCase();

    return this.todos
      .filter((todo) => {
        const matchesStatus =
          this.statusFilter === 'all' ||
          (this.statusFilter === 'completed' && todo.completed) ||
          (this.statusFilter === 'pending' && !todo.completed);
        const matchesSearch =
          !searchTerm ||
          [todo.title, String(todo.id), String(todo.userId)].some((value) =>
            value.toLocaleLowerCase().includes(searchTerm)
          );

        return matchesStatus && matchesSearch;
      })
      .sort((first, second) =>
        this.sortOrder === 'newest' ? second.id - first.id : first.id - second.id
      );
  }
}
