import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription, map } from 'rxjs';

import { Post } from './post.model';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})


export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postService: PostsService) {}

  ngOnInit() {
    this.errorSub = this.postService.error.subscribe(errorMessage => {
      this.error = errorMessage
    })
  }

  onCreatePost(postData: Post) {
   this.postService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(posts =>{
      this.isFetching = false;
      this.loadedPosts = posts
    }, error => {
      this.isFetching = false;
      this.error = error.error.error;
      console.log(error)
    });
  }

  onClearPosts() {
    // Send Http request
    this.postService.clearPosts().subscribe(()=>{
      this.loadedPosts = [];
    })
  }
  onHandleError(){
    this.error = null;
  }

  ngOnDestroy(): void {
      this.errorSub.unsubscribe();
  }
}
