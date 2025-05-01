import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BlogService, Post } from '../services/blog.service';

@Component({
  selector: 'app-blog-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './blog-admin.component.html',
  styleUrls: ['./blog-admin.component.scss']
})
export class BlogAdminComponent implements OnInit {
  postForm!: FormGroup;
  posts: Post[] = [];

  constructor(private fb: FormBuilder, private blogService: BlogService) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      excerpt: ['', Validators.required],
      image: ['', Validators.required],
      url: ['', Validators.required]
    });
    this.fetchPosts();
  }

  private fetchPosts() {
    this.blogService.getPosts().subscribe(p => (this.posts = p));
  }

  addPost() {
    if (this.postForm.invalid) return;
    this.blogService.addPost(this.postForm.value).subscribe(newPost => {
      this.posts.push(newPost);
      this.postForm.reset();
    });
  }

  deletePost(idx: number) {
    const id = this.posts[idx].id!;
    this.blogService.deletePost(id).subscribe(() => {
      this.posts.splice(idx, 1);
    });
  }
}
