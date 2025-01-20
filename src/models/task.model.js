import mongoose from "mongoose";
import { setCurrentTimestamp } from "../helpers/dateFunction.helper.js";
import constants from "../../config/constants.js";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: null,
  },
  description: {
    type: String,
    trim: true,
    default: null,
  },
  priority: {
    type: Number,
    trim: true,
    lowercase: true,
    default: constants.TASK_PRIORITY.MEDIUM,
  },
  status: {
    type: Number,
    default: constants.TASK_STATUS.INCOMPLETE,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

const Task = mongoose.model("tasks", taskSchema);

export default Task;
