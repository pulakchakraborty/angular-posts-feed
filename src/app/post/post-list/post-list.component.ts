import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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

  // Spinner Flag
  isLoading = false;
  posts: Post[] = [];
  totalPosts = 20;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5];
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
    // Load the Spinner before getting the posts
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);

    // next set up a listener to the subject postsUpdated  and store the subscription in a property postsSub
    this.postsSub = this.postsService.getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;   // Turn off the spinner once posts are loaded
        this.posts = posts;
      })
  }

  // This method accesses the service to delete a particular post
  onDelete(postId: string) {
    // Load the Spinner before deleting a post
    this.isLoading = true;
    this.postsService.deletePost(postId);
  }

  // Call this method whenever we change page. PageEvent is an object holding data about the current page.
  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
    this.isLoading = true;
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();    // call unsubscribe and prevent memory leaks
  }
}
