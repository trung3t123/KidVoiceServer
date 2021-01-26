import express from 'express';
import { postBook, openBook, showAllBook, addBookToUser,getUserBook, downloadBook } from '../controller/Book.js';


const bookRoute = express.Router();

bookRoute.post('/postBook', postBook);
bookRoute.get('/openBook/:bookId', openBook);
bookRoute.get('/getAllBook', showAllBook);
bookRoute.post('/addBookToUser', addBookToUser);
bookRoute.post('/getUserBooks',getUserBook);


export default bookRoute;
