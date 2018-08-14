import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private restApiUrl: string = environment.rest_api_url;

  constructor(private httpClient: HttpClient) { 

  }
  
  public getComments(postId: number): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(`${this.restApiUrl}/posts/${postId}/comments`);
  }
}
