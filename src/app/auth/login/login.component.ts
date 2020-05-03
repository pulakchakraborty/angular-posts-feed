import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;

  constructor(public authService: AuthService) {}

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) {
      console.log("invalid form data");
      return;
    }
    this.authService.loginUser(loginForm.value.email, loginForm.value.password);
  }
}
