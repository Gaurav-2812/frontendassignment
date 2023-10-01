import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../model/task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  serviceURL: string;

  constructor(private http: HttpClient) { 
    // Update the service URL to point to your backend server
    this.serviceURL = "http://localhost:4000";
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.serviceURL}/tasks`, task);
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.serviceURL}/tasks`);
  }

  deleteTask(task: Task): Observable<Task> {
    return this.http.delete<Task>(`${this.serviceURL}/tasks/${task._id}`);
  }
  
  editTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.serviceURL}/tasks/${task._id}`, task);
  }

  completeTask(task: Task): Observable<Task> {
    task.status = true; // Mark the task as completed
    return this.http.put<Task>(`${this.serviceURL}/tasks/complete/${task._id}`, task);
  }

  incompleteTask(task: Task): Observable<Task> {
    task.status = false; // Mark the task as incomplete
    return this.http.put<Task>(`${this.serviceURL}/tasks/incomplete/${task._id}`, task);
  }

  getCompletedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.serviceURL}/tasks/completed`);
  }

  getIncompleteTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.serviceURL}/tasks/incomplete`);
  }

  deleteCompletedTask(task: Task): Observable<Task> {
    return this.http.delete<Task>(`${this.serviceURL}/tasks/complete/${task._id}`);
  }

  deleteIncompleteTask(task: Task): Observable<Task> {
    return this.http.delete<Task>(`${this.serviceURL}/tasks/incomplete/${task._id}`);
  }
}