import express from 'express';
import { openTrack, getAllTracks, addTrackToPlaylist, upTrack, getTrackImage,getTrackListPage, downloadTrack } from '../controller/Track.js';
import { createPlaylist, getAllUserPlaylist, getPlaylist, getAllPlaylist } from '../controller/PlayList.js';

const trackRoute = express.Router();

trackRoute.get('/openTrack/:trackID', openTrack);
trackRoute.get('/allTracks',getAllTracks);
trackRoute.post('/createPlaylist',createPlaylist);
trackRoute.post('/getAllUserPlaylist',getAllUserPlaylist);
trackRoute.post('/addTrackToPlaylist',addTrackToPlaylist);
trackRoute.post('/getPlaylist',getPlaylist);
trackRoute.get('/getAllPlaylist',getAllPlaylist);
trackRoute.post('/upTrack',upTrack);
trackRoute.get('/getTrackImage/:imageID',getTrackImage)
trackRoute.get('/getTrackListPage',getTrackListPage)


export default trackRoute;
