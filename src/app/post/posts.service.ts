import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Post } from './post.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiURL + "/posts";

@Injectable({providedIn: 'root'})  // alternative to declaring it in the providers section
export class PostsService {
  private posts: Post[] = [];   // set the array empty
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  /* inject HttpClient */
  constructor (private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    // return [...this.posts];   // use spread operator tocopy elements of posts array
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    // send a new http get request to fetch resources i.e. posts from the backend
    this.http.get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
    .pipe(map((postData) => {
      return {
        posts: postData.posts.map(post => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath
          };
        }),
        maxPosts: postData.maxPosts
      };
    }))
    .subscribe((transformedPostsData) => {
      this.posts = transformedPostsData.posts;
      this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostsData.maxPosts });
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
                BACKEND_URL + '/' + id
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
        BACKEND_URL, postData
      )

      .subscribe((responseData) => {
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
      .put(BACKEND_URL + '/' + id, postData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
        console.log("local post array:" + this.posts);
      });
  }

  // this method sends new http DELETE request for a resource in the backend
  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + '/' + postId);
  }
}
