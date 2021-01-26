import mongoose from "mongoose";
import multer from "multer";
import { Readable } from "stream";
import Book from "./../models/Book.js";
import User from "../models/User.js";
import { createWriteStream } from "fs";
const ObjectID = mongoose.mongo.ObjectID;
const database = mongoose.connection;

export async function openBook(req, res) {
  try {
    var bookId = new ObjectID(req.params.bookId);
  } catch (err) {
    return res.status(400).json({
      message:
        "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters",
    });
  }
  res.set("content-type", "application/pdf");
  res.set("accept-ranges", "bytes");
  let db = database.db;

  let bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "Book",
  });

  let downloadStream = bucket.openDownloadStream(bookId);

  downloadStream.on("data", (chunk) => {
    res.write(chunk);
  });

  downloadStream.on("error", () => {
    res.sendStatus(404);
  });

  downloadStream.on("end", () => {
    res.end();
  });
}

export async function addBookToUser(req, res) {
  try {
    const book = await Book.findOne({ _id: req.body.bookId });
    const user = await User.findOne({ _id: req.body.userId });
    user.books.push(book);
    await user
      .save()
      .then((data) => {
        return res.status(201).json({
          success: true,
          message: "New Book added to user successfully",
          book: book,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "Server error. Please try again.",
          error: error.message,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
      error: error,
    });
  }
}

export async function getUserBook(req, res) {
  console.log("userId", req.body.userId);
  try {
    await User.findOne({ _id: req.body.userId })
      .populate("books")
      .then((user) => {
        return res.status(200).json({
          success: true,
          message: "A list of playlist",
          books: user.books,
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error. Please try again.",
          error: err.message,
        });
      });
  } catch {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
      error: err.message,
    });
  }
}

export async function showAllBook(req, res) {
  let viewedCount = 5 * (req.params.page - 1);
  let currentResultInPage = 5;

  Book.find()
    .select("_id bookName trackId bookImage")
    .skip(viewedCount)
    .limit(currentResultInPage)
    .then((allBooks) => {
      return res.status(200).json({
        success: true,
        message: "A list of all Books",
        books: allBooks,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: err.message,
      });
    });
}

export async function postBook(req, res) {
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    limits: { fileSize: 6000000000, files: 10 },
  });
  upload.any()(req, res, (err) => {
    if (err) {
      console.log("error", err);
      return res
        .status(400)
        .json({ message: "Upload Request Validation Failed" });
    } else if (!req.body.bookName) {
      return res.status(400).json({ message: "No track name in request body" });
    }

    let bookName = req.body.bookName;
    console.log("file pdf", req.files);

    const readableTrackStream = new Readable();
    readableTrackStream.push(req.files[0].buffer);
    readableTrackStream.push(null);
    let db = database.db;
    let bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "Book",
    });

    let uploadStream = bucket.openUploadStream(bookName);
    let id = uploadStream.id;
    readableTrackStream.pipe(uploadStream);

    const readableTrackStreamImage = new Readable();
    readableTrackStreamImage.push(req.files[1].buffer);
    readableTrackStreamImage.push(null);
    let bucketImage = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "Image",
    });

    let uploadStreamImage = bucketImage.openUploadStream(bookName);
    let imageId = uploadStreamImage.id;
    readableTrackStreamImage.pipe(uploadStreamImage);
    uploadStreamImage.on("error", () => {
      return res.status(500).json({ message: "Error uploading file" });
    });

    uploadStream.on("error", () => {
      return res.status(500).json({ message: "Error uploading file" });
    });

    uploadStream.on("finish", () => {
      const book = new Book({
        _id: id,
        bookName: req.body.bookName,
        trackId: req.body.trackId,
        bookImage: imageId,
      });
      return book
        .save()
        .then(async function (newBook) {
          return res.status(201).json({
            success: true,
            message: "New book created successfully",
            book: newBook,
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
            error: error.message,
            loggedIn: false,
          });
        });
    });
  });
  // console.log('db', db);
}

export async function downloadBook(req, res) {
  try {
    var bookId = new ObjectID(req.params.bookId);
  } catch (err) {
    return res.status(400).json({
      message:
        "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters",
    });
  }
  let db = database.db;

  let bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "Book",
  });

  const book = await Book.findOne({ _id: req.params.bookId }).select(
    "bookName"
  );

  let downloadStream = bucket
    .openDownloadStream(bookId)
    .pipe(createWriteStream(book.bookName + ".pdf"));

  downloadStream.on("data", (chunk) => {
    console.log("chunk", chunk);
  });

  downloadStream.on("finish", () => {
    console.log("done downloading");
    return res.status(200).json({
      successDownload: true,
      message: "A list of playlist",
      bookName: book.bookName,
    });
  });

  downloadStream.on("error", () => {
    res.sendStatus(404);
  });

  downloadStream.on("end", () => {
    res.end();
  });
}
