import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Axios from "axios";

export async function createUser(req, res) {
  const user = new User({
    _id: mongoose.Types.ObjectId(),
    userName: req.body.userName,
    userPassword: await bcrypt.hash(req.body.userPassword, 8),
    userMail: req.body.userMail,
  });
  return user
    .save()
    .then(async function (newUser) {
      const token = await user.generateAuthToken();
      return res.status(201).json({
        success: true,
        message: "New user created successfully",
        user: newUser,
        token: token,
        loggedIn: true,
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
}

export async function getMyUserProfile(req, res) {
  if (req.user) {
    // View logged in user profile
    res.send({
      user: req.user,
      loggedIn: true,
    });
  } else
    res.send({
      message: "error , no user found",
    });
}

export async function logoutAccount(req, res) {
  // Log user out of the application
  try {
    const user = await User.findOne({
      _id: req.user._id,
      "tokens.token": req.token,
    });
    console.log("user found to logout", user);
    user.tokens = user.tokens.filter((token) => {
      return token.token != req.token;
    });
    console.log("user", user);
    await user.save();
    res.send({
      message: "logged out",
      loggedIn: false,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function loginUser(req, res) {
  try {
    console.log("hello");
    const { userMail, userPassword } = req.body;
    const user = await User.findByCredentials(userMail, userPassword);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    const responseUser = {
      _id: user._id,
      userPhone: user.userPhone,
      userMail: user.userMail,
    };
    res.send({ user: responseUser, token, loggedIn: true });
  } catch (error) {
    console.log("error", error);
    res.status(400).send(error);
  }
}

export function getAllUser(req, res) {
  User.find()
    .select("_id userName facebookId userPassword playlist userMail tokens")
    .then((allUser) => {
      return res.status(200).json({
        success: true,
        message: "A list of all users",
        Course: allUser,
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

export async function loginFacebook(req, res) {
  try {
    const user = await User.findOne({ facebookId: req.body.userID });
    const token = await user.generateAuthToken();
    const responseUser = {
      _id: user._id,
      userPhone: user.userPhone,
      userMail: user.userMail,
      userName: user.userName,
      facebookId: user.facebookId,
    };
    res.send({
      user: responseUser,
      token: token,
      loggedIn: true,
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send(error);
  }
}

export function createFacebookUser(facebookId, userName, userMail, res) {
  const user = new User({
    _id: mongoose.Types.ObjectId(),
    facebookId: facebookId,
    userName: userName,
    userMail: userMail,
  });
  return user
    .save()
    .then(async (newUser) => {
      const token = await user.generateAuthToken();
      return res.status(201).json({
        success: true,
        message: "New user created successfully",
        user: newUser,
        token: token,
        loggedIn: true,
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
}
