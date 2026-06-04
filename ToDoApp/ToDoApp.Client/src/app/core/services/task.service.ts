import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskModel, UpdateTaskModel, TaskPagedResult } from '../models/todo.models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5280/api/tasks';

  getTasks(
    page: number = 1,
    pageSize: number = 10,
    isCompleted?: boolean | null,
    categoryId?: number | null,
    search?: string | null
  ): Observable<TaskPagedResult> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (isCompleted !== undefined && isCompleted !== null) {
      params = params.set('isCompleted', isCompleted.toString());
    }

    if (categoryId !== undefined && categoryId !== null) {
      params = params.set('categoryId', categoryId.toString());
    }

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<TaskPagedResult>(this.apiUrl, { params });
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(model: CreateTaskModel): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, model);
  }

  updateTask(id: number, model: UpdateTaskModel): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, model);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
