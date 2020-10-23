import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const trackSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	url: {
		type: String,
	},
	trackType : {
		type: String,
	},
	title: {
		type: String,
	},
	artist: {
		type: String,
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
	playList : [{
		type: mongoose.Schema.Types.ObjectId,
		ref : "Playlist"
	}]
});

const Track = mongoose.model('Track', trackSchema);
export default Track;
