import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private restApiUrl: string = environment.rest_api_url;

  private editPost: BehaviorSubject<Post> = new BehaviorSubject({userId: 2, title: '', body: ''});

  public editPostEvent = this.editPost.asObservable();

  constructor(private httpClient: HttpClient) { 
  }

  public getPosts(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(`${this.restApiUrl}/posts`);
  }
  
  public getPost(id: number): Observable<Post> {
    return this.httpClient.get<Post>(`${this.restApiUrl}/posts/${id}`);
  }

  public createPost(post: Post): Observable<Post> {
    return this.httpClient.post<Post>(`${this.restApiUrl}/posts`, post);
  }

  public updatePost(post: Post): Observable<Post> {
    return this.httpClient.put<Post>(`${this.restApiUrl}/posts/${post.id}`, post);
  }

  public deletePost(id: number): Observable<Object> {
    return this.httpClient.delete<Object>(`${this.restApiUrl}/posts/${id}`);
  }  

  public emitEditEvent(post: Post): void {
    this.editPost.next(post);
  }

  public clonePost(post: Post): Post {
    const clonedPost: Post = {
      userId: post.userId,
      id: post.id,
      title: post.title,
      body: post.body,
      // not copy, just set reference 
      comments: post.comments
    } 
    return clonedPost; 
  }

}
