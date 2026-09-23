import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(user: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  deactivateUser(id: number): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  reactivateUser(id: number): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/${id}/reactivate`, {});
  }
}
