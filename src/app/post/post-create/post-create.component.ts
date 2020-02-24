import { Component } from '@angular/core';

@Component ({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html'
})
export class PostCreateComponent {
  enteredValue = '';
  newPost = 'No Content';

  onAddPost() {
    this.newPost = this.enteredValue;
    //this.newPost = "The user\'s post";
  }
}
