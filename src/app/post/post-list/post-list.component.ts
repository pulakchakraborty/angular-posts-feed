import { Component, Input } from '@angular/core';

@Component ({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  //posts = [
  //  {title: "first post", content: "content of the first post"},
  //  {title: "second post", content: "content of the second post"},
  //  {title: "third post", content: "content of the third post"}
  //];
  @Input() posts = [];
}
