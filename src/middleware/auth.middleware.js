import jwt from "jsonwebtoken";
import constants from "../../config/constants.js";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JWT_SECRET;

export const auth = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) {
      return res.status(401).send({
        status: constants.STATUS_CODE.FAIL,
        message: "Unauthorized, please login.",
        error: true,
        data: {},
      });
    }

    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).send({
        status: constants.STATUS_CODE.FAIL,
        message: "Unauthorized, please login.",
        error: true,
        data: {},
      });
    }

    const decoded = jwt.verify(token, secretKey);

    const user = await User.findOne({
      _id: decoded._id,
      token: token,
    });

    if (!user) {
      return res.status(401).send({
        status: constants.STATUS_CODE.FAIL,
        message: "Unauthorized, please login.",
        error: true,
        data: {},
      });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);

    if (error.name === "TokenExpiredError") {
      return res.status(403).send({
        status: constants.STATUS_CODE.FAIL,
        message: "Forbidden - Token expired, please login.",
        error: true,
        data: {},
      });
    }

    return res.status(500).send({
      status: constants.STATUS_CODE.FAIL,
      message: "Something went wrong",
      error: true,
      data: {},
    });
  }
};
