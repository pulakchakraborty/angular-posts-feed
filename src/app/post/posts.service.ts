import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

@Injectable({providedIn: 'root'})  // alternative to declaring it in the providers section
export class PostsService {
  private posts: Post[] = [];   // set the array empty
  private postsUpdated = new Subject<Post[]>();

  /* inject HttpClient */
  constructor (private http: HttpClient) {}

  getPosts() {
    // return [...this.posts];   // use spread operator tocopy elements of posts array

    // send a new http get request to fetch resources i.e. posts from the backend
    this.http.get<{message: String, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          id: post._id,
          title: post.title,
          content: post.content
        };
      });
    }))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();    // returns an object to which we can listen but we cannot emit
  }

  // Fetch the post with a particular id for editing purpose
  getpost(id: string) {
    return {...this.posts.find(p => p.id === id)};
  }

  addPost(title: String, content: String) {
    const post: Post = {id: null, title: title, content: content};

    // send a new http POST request to add a resource in the backend
    this.http
      .post<{message: string, postId: string}>(
        'http://localhost:3000/api/posts', post
      )

      .subscribe((responseData) => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  // this method send a http PUT request for a particular resource in the backend
  updatePost(id: string, title: string, content: string) {
    const post: Post = {id: id, title: title, content: content};

    this.http
      .put('http://localhost:3000/api/posts/' + id, post)

      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  // this method sends new http DELETE request for a resource in the backend
  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        console.log('The post is deleted');
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
