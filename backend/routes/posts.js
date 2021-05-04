const express = require("express");
const extractFile = require("../middleware/file");
const checkAuth = require("../middleware/check-auth");
const PostController = require("../controllers/posts");

const router = express.Router();


//("",multer({ storage: storage }).single("image"), (req, res, next)->executes functions from left to right
//single->expecting a single file and will try to find in "image" property of request bodyi.e. postData.append("image"
router.post("",
  checkAuth,
  extractFile,
  PostController.createPost
);

router.put("/:id",
  checkAuth,
  extractFile,
  PostController.updatePost
);

router.get("", PostController.getPosts);

router.get("/:id", PostController.getPost);

//passing a refeence of checkAuth ,not the function
router.delete("/:id",
  checkAuth,
  PostController.deletePost
);

module.exports = router;
