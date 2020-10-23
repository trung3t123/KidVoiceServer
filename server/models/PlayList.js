import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const playlistSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	playlistName: {
		type: String,
	},
	userPassword: {
		type: String,
	},
	songList : [{
		type: mongoose.Schema.Types.ObjectId,
		ref : "Track"
	}]
});

const Playlist = mongoose.model('PLaylist', playlistSchema);
export default Playlist;
