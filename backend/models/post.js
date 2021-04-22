
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title:{ type:String, required: true},
    content:{ type:String, required: true},
    imagePath: {type:String, required: true},
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    //this id belongs to User saved in our database

});
// after schema mogoose needs models to work with it.
//schema is blueprint.Not a thing we work with our code.PointAt Just a blueprint
//now to create model(or object)

module.exports=mongoose.model('Post',postSchema);
//collection name will be plural form of post in loewercase ->posts

//after these model has been created it can be used to create javascript objects based on that model
//this .model('Post',postSchema); gives us the constructor to allow to construct new java object