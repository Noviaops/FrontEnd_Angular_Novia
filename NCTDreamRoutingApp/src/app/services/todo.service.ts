import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, defer, map, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface LocalTodoChanges {
  created: Todo[];
  updated: Todo[];
  deleted: number[];
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/todos';
  private readonly storageKey = 'nct-dream-todo-changes';

  constructor(private readonly http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      map((todos) => this.applyLocalChanges(todos)),
      catchError(this.handleError)
    );
  }

  getTodoById(id: number): Observable<Todo> {
    return defer(() => {
      const changes = this.readLocalChanges();
      if (changes.deleted.includes(id)) {
        throw new Error(`Todo #${id} sudah dihapus.`);
      }

      const localTodo =
        changes.updated.find((item) => item.id === id) ??
        changes.created.find((item) => item.id === id);

      if (localTodo) {
        return of(localTodo);
      }

      return this.http.get<Todo>(`${this.apiUrl}/${id}`).pipe(
        map((todo) => {
          const updatedTodo = changes.updated.find((item) => item.id === id);
          return updatedTodo ?? todo;
        })
      );
    }).pipe(
      catchError(this.handleError)
    );
  }

  createTodo(todo: Partial<Todo>): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      map((response) => {
        const changes = this.readLocalChanges();
        const id = Math.max(
          200,
          ...changes.created.map((item) => item.id),
          ...changes.updated.map((item) => item.id),
          ...changes.deleted
        ) + 1;
        const createdTodo: Todo = {
          id,
          userId: todo.userId ?? response.userId,
          title: todo.title ?? response.title,
          completed: todo.completed ?? response.completed
        };

        changes.created.push(createdTodo);
        this.writeLocalChanges(changes);
        return createdTodo;
      }),
      catchError(this.handleError)
    );
  }

  updateTodo(id: number, todo: Partial<Todo>): Observable<Todo> {
    return defer(() => {
      const changes = this.readLocalChanges();
      if (changes.created.some((item) => item.id === id)) {
        return of(this.persistUpdate(id, todo));
      }

      return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo).pipe(
        map((response) => this.persistUpdate(id, todo, response))
      );
    }).pipe(catchError(this.handleError));
  }

  deleteTodo(id: number): Observable<void> {
    return defer(() => {
      const changes = this.readLocalChanges();
      if (changes.created.some((todo) => todo.id === id)) {
        this.persistDelete(id);
        return of(undefined);
      }

      return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
        map(() => this.persistDelete(id))
      );
    }).pipe(catchError(this.handleError));
  }

  private persistUpdate(id: number, todo: Partial<Todo>, response?: Todo): Todo {
    const changes = this.readLocalChanges();
    const current =
      changes.updated.find((item) => item.id === id) ??
      changes.created.find((item) => item.id === id) ??
      response;

    if (!current) {
      throw new Error(`Data Todo #${id} tidak ditemukan untuk diperbarui.`);
    }

    const updatedTodo: Todo = {
      id,
      userId: todo.userId ?? current.userId,
      title: todo.title ?? current.title,
      completed: todo.completed ?? current.completed
    };

    changes.updated = changes.updated.filter((item) => item.id !== id);
    changes.updated.push(updatedTodo);
    this.writeLocalChanges(changes);
    return updatedTodo;
  }

  private persistDelete(id: number): void {
    const changes = this.readLocalChanges();
    changes.created = changes.created.filter((todo) => todo.id !== id);
    changes.updated = changes.updated.filter((todo) => todo.id !== id);

    if (!changes.deleted.includes(id)) {
      changes.deleted.push(id);
    }

    this.writeLocalChanges(changes);
  }

  private applyLocalChanges(todos: Todo[]): Todo[] {
    const changes = this.readLocalChanges();
    const deleted = new Set(changes.deleted);
    const updated = new Map(changes.updated.map((todo) => [todo.id, todo]));
    const visibleTodos = todos
      .filter((todo) => !deleted.has(todo.id))
      .map((todo) => updated.get(todo.id) ?? todo);
    const existingIds = new Set(visibleTodos.map((todo) => todo.id));

    return [
      ...visibleTodos,
      ...changes.created
        .filter((todo) => !deleted.has(todo.id) && !existingIds.has(todo.id))
        .map((todo) => updated.get(todo.id) ?? todo)
    ];
  }

  private readLocalChanges(): LocalTodoChanges {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return { created: [], updated: [], deleted: [] };
      }

      const changes: unknown = JSON.parse(stored);
      if (
        !this.isRecord(changes) ||
        !Array.isArray(changes['created']) ||
        !changes['created'].every((todo) => this.isTodo(todo)) ||
        !Array.isArray(changes['updated']) ||
        !changes['updated'].every((todo) => this.isTodo(todo)) ||
        !Array.isArray(changes['deleted']) ||
        !changes['deleted'].every((id: unknown) => Number.isInteger(id))
      ) {
        throw new Error('Format data Todo lokal tidak valid.');
      }

      return {
        created: changes['created'],
        updated: changes['updated'],
        deleted: changes['deleted']
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Format data Todo lokal tidak valid.') {
        throw error;
      }
      throw new Error('Data Todo lokal gagal dibaca dari penyimpanan browser.');
    }
  }

  private writeLocalChanges(changes: LocalTodoChanges): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(changes));
    } catch {
      throw new Error('Perubahan Todo gagal disimpan di browser.');
    }
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private isTodo(value: unknown): value is Todo {
    return (
      this.isRecord(value) &&
      Number.isInteger(value['userId']) &&
      Number.isInteger(value['id']) &&
      typeof value['title'] === 'string' &&
      typeof value['completed'] === 'boolean'
    );
  }

  private handleError(error: unknown): Observable<never> {
    if (!(error instanceof HttpErrorResponse)) {
      console.error('TodoService error:', error);
      return throwError(() =>
        error instanceof Error ? error : new Error('Terjadi kesalahan saat memproses Todo.')
      );
    }

    const message =
      error.status === 0
        ? 'JSONPlaceholder tidak dapat dijangkau. Periksa koneksi internet.'
        : `Permintaan gagal: ${error.message || 'Terjadi kesalahan server.'}`;

    console.error('TodoService error:', error);
    return throwError(() => new Error(message));
  }
}
