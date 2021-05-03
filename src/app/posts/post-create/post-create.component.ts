import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy  {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  private mode = "create";
  private postId: string;
  form: FormGroup;
  imagePreview: string;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator:postData.creator
          };
          //this.post=this.postsService.getPost(this.postId);
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });

  }
  onSavePost(form: NgForm) {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    /*event.target as HTMLInputElement tell angular that it is an input element
    which is of type files */
    this.form.patchValue({ image: file });
    //patch values set value to one control whereas setvalue to multiple controls of form
    //file->is an object
    this.form.get("image").updateValueAndValidity();
    //will run validotr on  this.form.patchValue({ image: file });
    console.log(file);
    /* when attached a file
    File {name: "Screenshot (367).png", lastModified: 1575790410424, lastModifiedDate: Sun Dec 08 2019 13:03:30 GMT+0530 (India Standard Time), webkitRelativePath: "", size: 346978, …}
lastModified: 1575790410424
lastModifiedDate: Sun Dec 08 2019 13:03:30 GMT+0530 (India Standard Time) {}
name: "Screenshot (367).png"
size: 346978
type: "image/png"
webkitRelativePath: ""
__proto__: File
    */
    console.log(this.form);
    /**
     * FormGroup {validator: null, asyncValidator: null, pristine: true, touched: false, _onCollectionChange: ƒ, …}
     * value:
content: null
image: File
lastModified: 1575790410424
lastModifiedDate: Sun Dec 08 2019 13:03:30 GMT+0530 (India Standard Time) {}
name: "Screenshot (367).png"
size: 346978
type: "image/png"
webkitRelativePath: ""
__proto__: File
title: null
     */
    //dataurl can be read by image tag
    const reader = new FileReader();
    //onLoad executed when it done loading certain item
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
