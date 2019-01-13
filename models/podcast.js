var mongoose = require("mongoose");

var podcastSchema = new mongoose.Schema({
   name: String,
   price: String,
   website: String,
   image: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   
   reviews: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Review"
      }
      ],
   rating: {
      type: Number,
      default: 0
   }   
});

module.exports = mongoose.model("Podcast", podcastSchema);