import Playlist from "../models/Playlist.js";
import mongoose from 'mongoose';
import User from "../models/User.js";

export async function createPlaylist(req, res) {
	const playlist = new Playlist({
		_id: mongoose.Types.ObjectId(),
		playlistName: req.body.playlistName,
		userId: req.body.userId,
	});
	try {
		const user = await User.findOne({ _id: req.body.userId });
		user.playlist.push(playlist);
		await user.save()
		await playlist.save()
			.then(async function (newPlaylist) {
				return res.status(201).json({
					success: true,
					message: 'New playlist created successfully',
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

	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error. Please try again.',
			error: error,
		});
	}

}

export async function getPlaylist(req, res) {
	try {
		const playlist = await Playlist.findOne({ _id: req.body.playlistId }).populate('trackList');
		res.send(playlist);
	} catch (error) {
		res.send(error)
	}

}



export async function getAllUserPlaylist(req, res) {
	try {
		console.log('userId', req.body.userId);
		const user = await User.findOne({ _id: req.body.userId }).populate("playlist");
		res.send(user);
	} catch (error) {
		res.send(error)
	}

}


export async function getAllPlaylist(req, res) {
	Playlist.find()
		.select('_id playlistName userId trackList')
		.then(allPlaylists => {
			return res.status(200).json({
				success: true,
				message: 'A list of playlist',
				playlist: allPlaylists,
			});
		})
		.catch((err) => {
			res.status(500).json({
				success: false,
				message: 'Server error. Please try again.',
				error: err.message,
			});
		})
	res.send(user);
}