import express from 'express';
import { openTrack, postTrack, getAllTracks, addTrackToPlaylist } from '../controller/Track.js';
import { createPlaylist, getAllUserPlaylist, getPlaylist, getAllPlaylist } from '../controller/PlayList.js';

const trackRoute = express.Router();

trackRoute.get('/openTrack/:trackID', openTrack);
trackRoute.post('/postTrack',postTrack);
trackRoute.get('/allTracks',getAllTracks);
trackRoute.post('/createPlaylist',createPlaylist);
trackRoute.post('/getAllUserPlaylist',getAllUserPlaylist);
trackRoute.post('/addTrackToPlaylist',addTrackToPlaylist);
trackRoute.post('/getPlaylist',getPlaylist);
trackRoute.get('/getAllPlaylist',getAllPlaylist);


export default trackRoute;