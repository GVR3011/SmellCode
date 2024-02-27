import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // Método público para obtener un usuario por su ID
  public getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`/api/users/${userId}`);
  }

}
