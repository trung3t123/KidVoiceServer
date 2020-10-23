import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import logger from 'morgan';
import mainRoutes from './server/routes/main.js';
import trackRoute from './server/routes/tracks.js';
// set up dependencies
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

mongoose.connect('mongodb://127.0.0.1:27017/kidvoiceserver', { useNewUrlParser: true, useUnifiedTopology: true })
	.then((db) => {
		
		console.log('Database connected');
	})
	.catch((error) => {
		console.log('Error connecting to database');
	});

// set up port
const port = 5035;
app.get('/', (req, res) => {
	res.status(200).json({
		message: 'Welcome to Project with Nodejs Express and MongoDB',
	});
});
// set up route
app.use('/tracks', trackRoute);
app.use('/api/', mainRoutes);

app.listen(port, () => {
	console.log(`Our server is running on port ${port}`);
});  