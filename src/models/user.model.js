import mongoose from "mongoose";
import { hashPassword } from "../utils/password.utils.js";
import { setCurrentTimestamp } from "../helpers/dateFunction.helper.js";
import { generateToken } from "../utils/token.utils.js";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    default: null,
  },
  lastName: {
    type: String,
    trim: true,
    default: null,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
  },
  token: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Number,
    default: setCurrentTimestamp,
  },
  updatedAt: {
    type: Number,
    default: setCurrentTimestamp,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hashedPassword = await hashPassword(this.password);
      this.password = hashedPassword;
    } catch (error) {
      console.log("Getting error while hashing a password", error);
      return next(error);
    }
  }
  next();
});

// for generating token
userSchema.methods.generateToken = async function () {
  const user = this;
  const token = await generateToken({ _id: user._id.toString() });

  user.token = token;

  await user.save();

  return token;
};

userSchema.methods.removeToken = function (token) {
  let user = this;
  return user.updateOne({
    $set: {
      token: null,
    },
  });
};

const User = mongoose.model("users", userSchema);

export default User;
