const multer = require("multer");
//multer is external package used to extract incoming files
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

module.exports = multer({ storage: storage }).single("image");