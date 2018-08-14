import { filter } from 'rxjs/operators';
import { ToastrService } from 'node_modules/ngx-toastr';
import { NgxSpinnerService } from 'node_modules/ngx-spinner';
import { CommentsService } from './../../services/comments.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {

  @Input('post') postItem: Post;
  @Output() deletePost: EventEmitter<number> = new EventEmitter();

  public isEdited: boolean = false;

  constructor(private commentsService: CommentsService,
              private postsService: PostsService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.postsService.editPostEvent
      .pipe(filter(() => this.isEdited))
      .subscribe((editedPost: Post) => {
        this.handleEditPostEvent(editedPost);
      });
  }

  private handleEditPostEvent(editedPost: Post) {
    if (this.postItem.id != editedPost.id) {
      this.isEdited = false;
    }
  }

  onDelete(id: number): void {
    this.deletePost.emit(id);
  }

  onEdit(post: Post): void {
    this.isEdited = true;
    this.postsService.emitEditEvent(this.postsService.clonePost(post));
  }

  onCancel(post: Post): void {
    this.postsService.emitEditEvent({userId: 2, title: '', body: ''});
  }

  public getPostComments(post: Post): void {

    if (post.comments) {
      post.comments = null;
    } else {

     this.spinner.show();

      this.commentsService.getComments(post.id)
        .subscribe((request: Comment[]) => {
          post.comments = request;
         this.spinner.hide();
        },
          error => {
           this.spinner.hide();
           this.toastr.error("Can not fetch comments from server", "Error", { timeOut: 3000 });
          }
        );
    }
  }
}
