var mongoose = require("mongoose");
//schema set up
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String  
    },
    comments: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment" 
    }]
});
//make a model that compiles the campgroundSchema and contains a bunch of methods
module.exports = mongoose.model("Campground", campgroundSchema); 