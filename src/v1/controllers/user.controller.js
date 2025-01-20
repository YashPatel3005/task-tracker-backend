import constants from "../../../config/constants.js";
import User from "../../models/user.model.js";
import { comparePasswords } from "../../utils/password.utils.js";
import { removeKeyFromObject } from "../../helpers/commonFunction.helper.js";

/**
 * Signup a user
 *
 * @body firstName, lastName, email, password
 *
 * @returns { userData, token }
 */
const signupHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required. Please enter your email.",
        status: constants.STATUS_CODE.FAIL,
        error: true,
        data: {},
      });
    }

    const doesUserExist = await User.findOne({ email: email });

    if (doesUserExist) {
      return res.status(400).json({
        message: "User already exists.",
        status: constants.STATUS_CODE.FAIL,
        error: true,
        data: {},
      });
    }

    const user = new User(req.body);

    const userdata = await user.save();

    const token = await userdata.generateToken();

    await removeKeyFromObject(userdata);

    return res.status(200).send({
      message: "User created successfully.",
      status: constants.STATUS_CODE.SUCCESS,
      error: false,
      data: { userdata, token },
    });
  } catch (error) {
    console.log("Error while signup", error);

    return res.status(500).send({
      status: constants.STATUS_CODE.FAIL,
      message: "Something went wrong",
      error: true,
      data: {},
    });
  }
};

/**
 * Login a user
 *
 * @body  email, password
 *
 * @returns { userData, token }
 */
const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required. Please enter your email.",
        status: constants.STATUS_CODE.FAIL,
        error: true,
        data: {},
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).send({
        status: constants.STATUS_CODE.NOT_FOUND,
        message: "User not found",
        error: false,
        data: {},
      });
    }

    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      return res.status(404).send({
        status: constants.STATUS_CODE.FAIL,
        message: "Invalid password",
        error: false,
        data: {},
      });
    }

    const token = await user.generateToken();
    user.token = token;

    const userData = await user.save();

    await removeKeyFromObject(userData);

    return res.status(200).send({
      status: constants.STATUS_CODE.SUCCESS,
      message: "Login success",
      error: false,
      data: { userData, token },
    });
  } catch (error) {
    console.log("Error while login", error);

    return res.status(500).send({
      status: constants.STATUS_CODE.FAIL,
      message: "Something went wrong",
      error: true,
      data: {},
    });
  }
};

/**
 * Logout a user
 *
 * @returns {}
 */
const logoutHandler = async (req, res) => {
  try {
    await req.user.removeToken(req.token);

    return res.status(200).send({
      message: "User logged out successfully.",
      status: constants.STATUS_CODE.SUCCESS,
      error: false,
      data: {},
    });
  } catch (error) {
    console.log("Error while logout", error);

    return res.status(500).send({
      status: constants.STATUS_CODE.FAIL,
      message: "Something went wrong",
      error: true,
      data: {},
    });
  }
};

export { signupHandler, loginHandler, logoutHandler };
