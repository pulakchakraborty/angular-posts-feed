import { Component, EventEmitter, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component ({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls:  ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredTitle = "";
  enteredContent = "";
  @Output() postCreated = new EventEmitter<Post>();

  constructor(public postsService: PostsService) {}   // inject the service via dependency injection

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    /* this uses event binding to pass the newly created posts
    const post: Post = {
      title: form.value.title,
      content: form.value.content
    };
    this.postCreated.emit(post);
    */

    this.postsService.addPost(form.value.title, form.value.content);    // use the service method addPost

  }
}
