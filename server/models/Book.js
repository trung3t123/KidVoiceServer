import mongoose from "mongoose";
import Track from "./Track.js";

mongoose.Promise = global.Promise;

const bookSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  bookName: {
    type: String,
    required: true,
  },
  trackId: {
    type: String,
  },
  bookImage: {
    type: String,
  },
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
