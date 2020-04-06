import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})  // alternative to declaring it in the providers section
export class PostsService {
  private posts: Post[] = [];   // set the array empty
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    return [...this.posts];   // use spread operator tocopy elements of posts array
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();    // returns an object to which we can listen but we cannot emit
  }

  addPost(title: String, content: String) {
    const post: Post = {title: title, content: content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
