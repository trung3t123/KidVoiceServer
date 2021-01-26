import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const trackSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  _id: {
    type: String,
    required: true,
  },
  trackType: {
    type: String,
    // required : true
  },
  trackImage: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  album: {
    type: String,
  },
  genre: {
    type: String,
  },
  date: {
    type: String,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
});

const Track = mongoose.model("Track", trackSchema);
export default Track;
