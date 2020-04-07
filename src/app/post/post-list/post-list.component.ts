import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component ({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  //posts = [
  //  {title: "first post", content: "content of the first post"},
  //  {title: "second post", content: "content of the second post"},
  //  {title: "third post", content: "content of the third post"}
  //];

  /* @Input not required while using dependency injection
  @Input() posts: Post[] = [];
  */

  posts: Post[] = [];
  private postsSub: Subscription;

  /* Alternative 1 to use the PostsService by dependency injection
  postsService: PostsService;

  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }
  */

  // Alternative 2 to use the PostsService by using the dependency injection - advanced TS syntax
  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.posts = this.postsService.getPosts();

    // next set up a listener to the subject postsUpdated  and store the subscription in a property postsSub
    this.postsSub = this.postsService.getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      })
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();    // call unsubscribe and prevent memory leaks
  }
}
