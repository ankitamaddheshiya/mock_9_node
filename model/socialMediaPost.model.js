const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
       
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        text: String,
        image: String,
        createdAt: Date,
        likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
        comments: [{
          user: { type: mongoose.Schema.ObjectId, ref: 'User' },
          text: String,
          createdAt: Date
        }]
      }
)


const postModel = new mongoose.model("socialMediaPost",postSchema)
module.exports = {
    postModel
}