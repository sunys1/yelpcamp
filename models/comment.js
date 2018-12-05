var mongoose = require("mongoose");
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" //ref refers to the model that we are going to refer to with the ObjectID
        },
        username: String
    }
});
module.exports = mongoose.model("Comment", commentSchema);