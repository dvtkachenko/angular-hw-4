import { ToastrService } from 'node_modules/ngx-toastr';
import { NgxSpinnerService } from 'node_modules/ngx-spinner';
import { PostsService } from './../../services/posts.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-add-new-post-form',
  templateUrl: './add-new-post-form.component.html',
  styleUrls: ['./add-new-post-form.component.css']
})
export class AddNewPostFormComponent implements OnInit {

  @Output() onAddNewPost: EventEmitter<Post> = new EventEmitter();
  @Output() onEditPost: EventEmitter<Post> = new EventEmitter();  

  @ViewChild("form") form: NgForm;

  public formPost: Post = {
    userId: 2,
    title: '',
    body: ''
  };

  constructor(private postsService: PostsService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.postsService.editPostEvent
      .subscribe((editedPost: Post) => {
        this.handleEditPostEvent(editedPost);
      });
  }

  private handleEditPostEvent(editedPost: Post) {
    this.form.resetForm();
    this.formPost = editedPost;
  }

  onAdd(): void {

    this.spinner.show();

    const clonedPost = this.postsService.clonePost(this.formPost);

    this.postsService.createPost(clonedPost)
      .subscribe((request: Post) => {
        clonedPost.id = request.id;
        this.onAddNewPost.emit(clonedPost);
        this.onCancel();  
        this.spinner.hide();
      },
        error => {
          this.spinner.hide();
          this.toastr.error("New post was not created", "Error", { timeOut: 3000 });
        }
      );
  }

  onEdit(): void {

    this.spinner.show();

    const clonedPost = this.postsService.clonePost(this.formPost);

    this.postsService.updatePost(clonedPost)
      .subscribe((updatedPost: Post) => {
        this.spinner.hide();
        this.onEditPost.emit(updatedPost);
        this.onCancel();
      },
        error => {
          this.spinner.hide();
          this.toastr.error("Post was not updated", "Error", { timeOut: 3000 });
        }
      );
  }

  onCancel(): void {
    this.form.resetForm();
    this.postsService.emitEditEvent({userId: 2, title: '', body: ''});
  }
}
