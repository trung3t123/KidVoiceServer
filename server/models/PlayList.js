import mongoose from 'mongoose';
import User from './User.js'
import Track from './Track.js'


mongoose.Promise = global.Promise;

const playlistSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	playlistName: {
		type: String,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref : "User"
	},
	trackList: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Track"
	}]
});

const Playlist = mongoose.model('PLaylist', playlistSchema);
export default Playlist;
