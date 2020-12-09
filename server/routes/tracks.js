import express from 'express';
import { openTrack, postTrack, getAllTracks, addTrackToPlaylist, upTrack, getTrackImage } from '../controller/Track.js';
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
trackRoute.post('/upTrack',upTrack);
trackRoute.get('/getTrackImage/:imageID',getTrackImage)


export default trackRoute;
