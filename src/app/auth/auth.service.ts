import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = `${environment.apiURL}/user`;

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {
    const signupUrl = `${BACKEND_URL}/signup`;
    const authData: AuthData = { email: email, password: password }
    this.http.post(signupUrl, authData)
      .subscribe(response => {
        console.log(response);
      });
  }
}
