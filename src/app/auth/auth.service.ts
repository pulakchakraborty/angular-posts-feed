import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = `${environment.apiURL}/user`;

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient) {};

  createUser(email: string, password: string) {
    const signupUrl = `${BACKEND_URL}/signup`;
    const authData: AuthData = { email, password }
    this.http.post(signupUrl, authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  loginUser(email: string, password: string) {
    const loginUrl = `${BACKEND_URL}/login`;
    const authData: AuthData = { email, password };
    this.http.post(loginUrl, authData)
    .subscribe(response => {
      console.log(response);
    })
  }
}
