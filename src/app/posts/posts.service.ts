import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { Post } from "./post.model";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient,
    private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  //previously it used to send json to server now it will be Formdata to include a file
  //formdata allows to enter text as well as blobs(images etc.)
  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    //image is the property we r trying ot acces in backend
    //"image", image, title ->3rd argument is the filename in backend

    this.http
      .post<{ message: string, post: Post }>(BACKEND_URL, postData)
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete(BACKEND_URL + postId);
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string,
      imagePath: string,
      creator: string
    }>(
      BACKEND_URL + id
    );
    //return {...this.posts.find(p=>p.id==id)};
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    //if we get a string image we need to  send json request but if we have a file then we have to upload as formdata
    //const post: Post = { id: id, title: title, content: content,imagePath:null };
    let postData: Post | FormData;
    //File will be a object .String will be not
    if (typeof image === "object") {
      postData = new FormData();
      /*
      The append() method of the FormData interface appends a new value onto an existing key inside a FormData object,
       or adds the key if it does not already exist. */
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
      //passing title as name we want to store in backend
    }//else if image is a string 
    else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }
}
