import express from "express";

import {
  loginHandler,
  signupHandler,
  logoutHandler,
} from "../controllers/user.controller.js";

import { auth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signupHandler);

router.post("/login", loginHandler);

router.post("/logout", auth, logoutHandler);

export default router;
