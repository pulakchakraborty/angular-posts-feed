import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component ({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls:  ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  private mode = 'create';
  private postId: string;
  //@Output() postCreated = new EventEmitter<Post>();

  // inject the service via dependency injection
  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getpost(this.postId)
          .subscribe(postData => {
            this.post = {id: postData._id, title: postData.title, content: postData.content};
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode == 'create') {
      // use the service method addPost when mode is create
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }

    /* this uses event binding to pass the newly created posts
    const post: Post = {
      title: form.value.title,
      content: form.value.content
    };
    this.postCreated.emit(post);
    */


    form.resetForm();
  }
}
