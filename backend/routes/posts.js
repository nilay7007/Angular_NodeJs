const express = require("express");
const multer = require("multer");
const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};
//where multer shud put files when it encounetrs in incoming request
// destination:is a functions when multer tries to save the file it detects
//file, cb:file is what it detectd.cb is where it will save the file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    //above is to check we r getting a suitable file i.e. png jpeg just an extr a security check
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
    //cb(error, "backend/images");->error or null ->whether u encountered an error
    //"backend/images"->where u want to save
    //interstingily backend/images is seen relative to server.js file
    //file.mimetype will be in images/jpg images/png etc.
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
    //create  a file name -> name + "-" + Date.now() + "." + ext
  }
});

//("",multer({ storage: storage }).single("image"), (req, res, next)->executes functions from left to right
//single->expecting a single file and will try to find in "image" property of request bodyi.e. postData.append("image"
router.post("",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename
    });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    });
  });

router.put("/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    Post.updateOne({ _id: req.params.id }, post).then(result => {
      res.status(200).json({ message: "Update successful!" });
    });
  });

router.get("", (req, res, next) => {
  //for pagination w e can fetch those detailsa as query parameter
  //if we re extrcating querie s or another from url then it will be a string
  //so connvert it to int by +
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();//it will be executed when .then is there(one functionality provided by mongoose to split 
  //queries)
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    //if on cuurentpage 3 with pagesize 10 then skippped 20 items
    //limit to fetch these number of documnets from collections
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
      //returned an promise
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;
