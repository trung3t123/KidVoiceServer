import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Axios from 'axios';
import multer from 'multer';
import { Readable } from 'stream';
import Track from './../models/Track.js';
import Playlist from '../models/Playlist.js';
const ObjectID = mongoose.mongo.ObjectID;
const database = mongoose.connection;


export async function openTrack(req, res) {
	try {
		var trackID = new ObjectID(req.params.trackID);
	} catch (err) {
		return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" });
	}
	res.set('content-type', 'audio/mp3');
	res.set('accept-ranges', 'bytes');
	let db = database.db

	let bucket = new mongoose.mongo.GridFSBucket(db, {
		bucketName: 'Track'
	});

	let downloadStream = bucket.openDownloadStream(trackID);

	downloadStream.on('data', (chunk) => {
		res.write(chunk);
	});

	downloadStream.on('error', () => {
		res.sendStatus(404);
	});

	downloadStream.on('end', () => {
		res.end();
	});
}

export async function postTrack(req, res) {
	const storage = multer.memoryStorage()
	const upload = multer({ storage: storage, limits: { fileSize: 6000000, files: 1 } });
	upload.single('Track')(req, res, (err) => {
		if (err) {
			console.log('error', err);
			return res.status(400).json({ message: "Upload Request Validation Failed" });
		} else if (!req.body.title) {
			return res.status(400).json({ message: "No track name in request body" });
		}

		let trackName = req.body.title;

		// Covert buffer to Readable Stream
		const readableTrackStream = new Readable();
		readableTrackStream.push(req.file.buffer);
		readableTrackStream.push(null);
		let db = database.db
		let bucket = new mongoose.mongo.GridFSBucket(db, {
			bucketName: 'Track'
		});

		let uploadStream = bucket.openUploadStream(trackName);
		let id = uploadStream.id;
		readableTrackStream.pipe(uploadStream);

		uploadStream.on('error', () => {
			return res.status(500).json({ message: "Error uploading file" });
		});

		uploadStream.on('finish', () => {
			const track = new Track({
				_id: id,
				title: req.body.title,
				artist: req.body.artist
			});
			return track
				.save()
				.then(async function (newTrack) {
					return res.status(201).json({
						success: true,
						message: 'New track created successfully',
						track: newTrack,
					});
				})
				.catch((error) => {
					console.log(error);
					res.status(500).json({
						success: false,
						message: 'Server error. Please try again.',
						error: error.message,
						loggedIn: false
					});
				});
		});

	});
	// console.log('db', db);
}

export async function getAllTracks(req, res) {
	Track.find()
		.select('_id title artist album genre date playlist')
		.then((allTracks) => {
			return res.status(200).json({
				success: true,
				message: 'A list of all tracks',
				tracks: allTracks,
			});
		})
		.catch((err) => {
			res.status(500).json({
				success: false,
				message: 'Server error. Please try again.',
				error: err.message,
			});
		});
}
export async function addTrackToPlaylist(req, res) {
	try {
		const track = await Track.findOne({ _id: req.body.trackId })
		const playlist = await Playlist.findOne({ _id: req.body.playlistId })
		if (!playlist) {
			res.status(404).json({
				success: false,
				message: 'no playlist found'
			})
		} else {
			playlist.trackList.push(track)
			await playlist.save()
				.then(async function (newPlaylist) {
					return res.status(201).json({
						success: true,
						message: ' playlist updated successfully',
						playlist: newPlaylist,
					});
				})
				.catch((error) => {
					console.log(error);
					res.status(500).json({
						success: false,
						message: 'Server error. Please try again.',
						error: error.message,
					});
				});
		}
	}
	catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error. Please try again.',
			error: error.message,
		})
	}
}