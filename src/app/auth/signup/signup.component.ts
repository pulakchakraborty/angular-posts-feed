import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  isLoading = false;

  constructor(public authService: AuthService) {}

  onSignup(signupForm: NgForm) {
    if (signupForm.invalid) {
      console.log("invalid input");
      return;
    }
    this.authService.createUser(signupForm.value.email, signupForm.value.password);
  }
}
