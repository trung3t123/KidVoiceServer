import express from 'express';
import { openTrack, postTrack } from '../controller/Track.js';

const trackRoute = express.Router();

trackRoute.get('/:trackID', openTrack);
trackRoute.post('/',postTrack);

export default trackRoute;