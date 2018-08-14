import { NgxSpinnerService } from 'node_modules/ngx-spinner';
import { ToastrService } from 'node_modules/ngx-toastr';
import { PostsService } from './../../services/posts.service';
import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  public posts: Post[];

  constructor(private postsService: PostsService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService) { }

  ngOnInit() {

    this.spinner.show();

    this.postsService.getPosts()
      .subscribe((request: Post[]) => {
        this.posts = request;
        this.spinner.hide();
      },
        error => { 
          this.spinner.hide();
        }
      );
  }

  onAddPost(post: Post): void {
    this.posts.unshift(post);
    this.toastr.success("New post was successfully created", "Info", { timeOut: 3000 });
  }

  onEditPost(editedPost: Post): void {

    const editedPostIndex = this.posts.findIndex(item => item.id === editedPost.id);

    if (editedPostIndex === -1) {
      this.toastr.success("Post was not found", "Info", { timeOut: 3000 });
      return;
    } else {
      this.posts[editedPostIndex] = editedPost;     
      this.toastr.success("Post was successfully updated", "Info", { timeOut: 3000 }); 
    }   
  }

  onDelete(id: number): void {

    this.spinner.show();

    this.postsService.deletePost(id)
      .subscribe((data: Object) => {
        this.posts = this.posts.filter(filteredPost => filteredPost.id != id);
        // to clear form if there is an edited post
        this.postsService.emitEditEvent({userId: 2, title: '', body: ''});
        this.spinner.hide();
        this.toastr.success("Post was successfully deleted", "Info", { timeOut: 3000 });
      },
        error => {
          this.spinner.hide();
          this.toastr.error("Post was not deleted", "Error", { timeOut: 3000 });
        }
      );
  }
}
