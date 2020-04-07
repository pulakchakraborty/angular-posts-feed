import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})  // alternative to declaring it in the providers section
export class PostsService {
  private posts: Post[] = [];   // set the array empty
  private postsUpdated = new Subject<Post[]>();

  /* inject HttpClient */
  constructor (private http: HttpClient) {}

  getPosts() {
    // return [...this.posts];   // use spread operator tocopy elements of posts array

    // send a new http get request to fetch resources i.e. posts from the backend
    this.http.get<{message: String, posts: Post[]}>('http://localhost:3000/api/posts')
    .subscribe((postData) => {
      this.posts = postData.posts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();    // returns an object to which we can listen but we cannot emit
  }

  addPost(title: String, content: String) {
    const post: Post = {id: null, title: title, content: content};

    // send a new http post request to add a resource in the backend
    this.http.post<{message: String}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
