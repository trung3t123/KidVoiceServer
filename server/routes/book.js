import express from "express";
import {
  postBook,
  openBook,
  showAllBook,
  addBookToUser,
  getUserBook,
  downloadBook,
  searchBook,
} from "../controller/Book.js";

const bookRoute = express.Router();

bookRoute.post("/postBook", postBook);
bookRoute.get("/openBook/:bookId", openBook);
bookRoute.get("/getAllBook/:page", showAllBook);
bookRoute.post("/addBookToUser", addBookToUser);
bookRoute.post("/getUserBooks", getUserBook);
bookRoute.get("/searchBook/:text", searchBook);

export default bookRoute;
