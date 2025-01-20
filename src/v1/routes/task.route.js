import express from "express";

import {
  addTaskHandler,
  deleteTaskHandler,
  getTaskListHandler,
  updateTaskHandler,
} from "../controllers/task.controller.js";

import { auth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add-task", auth, addTaskHandler);

router.patch("/update-task/:id", auth, updateTaskHandler);

router.get("/get-tasks", auth, getTaskListHandler);

router.delete("/delete-task/:id", auth, deleteTaskHandler);

export default router;
