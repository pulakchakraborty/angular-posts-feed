import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import  { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Injectable({providedIn: 'root'})  // alternative to declaring it in the providers section
export class PostsService {
  private posts: Post[] = [];   // set the array empty
  private postsUpdated = new Subject<Post[]>();

  /* inject HttpClient */
  constructor (private http: HttpClient, private router: Router) {}

  getPosts() {
    // return [...this.posts];   // use spread operator tocopy elements of posts array

    // send a new http get request to fetch resources i.e. posts from the backend
    this.http.get<{message: String, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          id: post._id,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath
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
    // return {...this.posts.find(p => p.id === id)};
    return this.http
              .get<{ _id: string, title: string, content: string, imagePath: string }>(
                'http://localhost:3000/api/posts/' + id
              );
  }

  addPost(title: string, content: string, image: File) {
    /* Comment out because of file upload
    const post: Post = {id: null, title: title, content: content};
    */

    // Configure a new Form Data to be passed on as a http get request argument
    const postData = new FormData();
    // note that name of first parameter is important because of backend
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    // send a new http POST request to add a resource in the backend
    this.http
      .post<{message: string, post: Post }>(
        'http://localhost:3000/api/posts', postData
      )

      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        /* Comment out because of JSON -> FormData change
        const id = responseData.postId;
        post.id = id;
        */
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  // this method send a http PUT request for a particular resource in the backend
  updatePost(id: string, title: string, content: string, image: File | string) {
    //const post: Post = {id: id, title: title, content: content, imagePath: null};
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {id: id, title: title, content: content, imagePath: image};
    }

    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)

      .subscribe((responseData) => {
        console.log(responseData);
        // Update the post array locally
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: ""
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
        console.log("local post array:" + this.posts);
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
