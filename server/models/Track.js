import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const trackSchema = new mongoose.Schema({
	// _id: mongoose.Schema.Types.ObjectId,
	_id : {
		type: String,
		required: true
	},
	trackType : {
		type: String,
		// required : true
	},
	title: {
		type: String,
		required : true
	},
	artist: {
		type: String,
		required : true
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
});

const Track = mongoose.model('Track', trackSchema);
export default Track;
