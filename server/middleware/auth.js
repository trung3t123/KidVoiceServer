import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Axios from 'axios';
import { createFacebookUser } from '../controller/User.js';


const auth = async (req, res, next) => {
	const token = req.header('Authorization').replace('Bearer ', '')
	const data = jwt.verify(token, "SneakMartNC")
	try {
		const user = await User.findOne({ _id: data._id, 'tokens.token': token })
		console.log('user', user);
		if (!user) {
			console.log('cant find user');
			throw new Error()
		}

		const userDetails = {
			_id: user._id,
			userName: user.userName,
			userMail: user.userMail,
		}
		req.user = userDetails
		req.token = token
		next()
	} catch (error) {
		console.log('error');
		res.status(401).send({ error: 'Not authorized to access this resource' })
	}
}

export default auth;

export const authFacebook = (req, res, next) => {
	const facebookToken = req.body.userToken;
	return Axios.get('https://graph.facebook.com/v2.5/me?fields=email,name&access_token=' + facebookToken)
		.then(async (data) => {
			console.log('data', data.data);
			const user = await User.findOne({ facebookId: data.data.id, userName: data.data.name });
			if (user) {
				console.log('user found');
				next()
			} else {
				console.log('no user found creating new userFacebook');
				(data.data.email) ?
					createFacebookUser(data.data.id, data.data.name, data.data.email, res) :
					createFacebookUser(data.data.id, data.data.name, '', res)
			}
		})
		.catch((error) => {
			console.log('ERROR GETTING DATA FROM FACEBOOK', error);
		})
}