const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require('mongoose');
//postModel will be a bridge betwen nodejs and mongoosedb without us writing any mongocode
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const app = express();

mongoose.connect("mongodb+srv://nilay7007:" +
process.env.MONGO_ATLAS_PW +
"@cluster0.ctrbe.mongodb.net/angular_node?retryWrites=true&w=majority")
.then(() => {
  console.log("Connected to database!");
})
.catch(() => {
  console.log("Connection failed!");
});

app.use(bodyParser.json());
//middleware for parsing json objects 
app.use(bodyParser.urlencoded({ extended: false }));
//middleware for parsing bodies from URL.
app.use("/images", express.static(path.join("backend/images")));
//any request with /image is allowed to continue and fetch their file from there
//to give access to images folder to request with /images
//path.join path to construct path to my backend imagesfolder so that request with /images go to backend/images folder
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  /**
   * CORS, or Cross Origin Resource Sharing, is a mechanism for browsers
   *  to let a site running at origin A to request resources from origin B.
   */
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST,PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

// app.post("/api/posts", (req, res, next) => {
//   const post = new Post({
//     title: req.body.title,
//     content: req.body.content
//   });
//   post.save().then(createdPost => {
//     res.status(201).json({
//       message: "Post added successfully",
//       postId: createdPost._id
//     });
//   });
//   //console.log(post);
//   /*{
//     _id: 607d7129475ef34aacf50fbd,
//     title: 'orange',
//     content: 'aaaaaaaaaaa'
//   }*/
  
// });
// app.put("/api/posts/:id", (req, res, next) => {
//   const post = new Post({
//     _id: req.body.id,
//     title: req.body.title,
//     content: req.body.content
//   });
//   Post.updateOne({ _id: req.params.id }, post).then(result => {
//     res.status(200).json({ message: "Update successful!" });
//   });
// });

// app.get("/api/posts/:id", (req, res, next) => {
//   Post.findById(req.params.id).then(post => {
//     if (post) {
//       res.status(200).json(post);
//     } else {
//       res.status(404).json({ message: "Post not found!" });
//     }
//   });
// });

// app.get("/api/posts", (req, res, next) => {
//   Post.find().then(documents => {
//     res.status(200).json({
//       message: "Posts fetched successfully!",
//       posts: documents
//     });
//   });
// });

// app.delete("/api/posts/:id", (req, res, next) => {
//   Post.deleteOne({ _id: req.params.id }).then(result => {
//     console.log(result);
//     res.status(200).json({ message: "Post deleted!" });
//   });
// });
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);


module.exports = app;
