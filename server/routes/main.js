import express from 'express';
import { createUser, getAllUser, loginUser, getMyUserProfile, logoutAccount, loginFacebook, } from '../controller/User.js';
import auth, { authFacebook } from '../middleware/auth.js';
const mainRoutes = express.Router();

mainRoutes.post('/user', createUser);
mainRoutes.get('/users', getAllUser);
mainRoutes.post('/user/postLogin', loginUser);
mainRoutes.get('/users/me', auth, getMyUserProfile);
mainRoutes.post('/users/logout', auth, logoutAccount);
mainRoutes.post('/users/loginFacebook', authFacebook, loginFacebook);


export default mainRoutes;
