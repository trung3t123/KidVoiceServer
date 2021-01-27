import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import PlayLists from "./Playlist.js";

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userName: {
    type: String,
  },
  enrolled: {
    type: Boolean,
  },
  userPassword: {
    type: String,
  },
  userMail: {
    type: String,
    // required: true,
    unique: true,
  },
  facebookId: {
    type: String,
  },
  playlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PLaylist",
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

userSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id }, "SneakMartNC");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (userMail, userPassword) => {
  // Search for a user by email and password.
  console.log("userPhone", userMail);
  console.log("password", userPassword);
  const user = await User.findOne({ userMail });
  if (!user) {
    throw new Error({ error: "Invalid login credentials" });
  }
  console.log("user", user);
  const isPasswordMatch = await bcrypt.compare(userPassword, user.userPassword);
  console.log("isPasswordMatch", isPasswordMatch);
  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid login credentials" });
  }
  return user;
};

const User = mongoose.model("User", userSchema);
export default User;
