import constants from "../../../config/constants.js";
import Task from "../../models/task.model.js";

/**
 * Add new task
 *
 * @body title, description, priority
 *
 * @returns { taskData }
 */
export const addTaskHandler = async (req, res) => {
  try {
    const { title } = req.body;

    const doesTaskExist = await Task.findOne({ title });

    if (doesTaskExist) {
      return res.status(400).json({
        message: "Task already exists.",
        status: constants.STATUS_CODE.FAIL,
        error: true,
        data: {},
      });
    }

    const task = new Task(req.body);
    task.userId = req.user.id;

    const taskData = await task.save();

    return res.status(200).send({
      message: "Task created successfully.",
      status: constants.STATUS_CODE.SUCCESS,
      error: false,
      data: taskData,
    });
  } catch (error) {
    console.log("Error while adding task", error);

    return res.status(500).send({
      status: constants.STATUS_CODE.FAIL,
      message: "Something went wrong",
      error: true,
      data: {},
    });
  }
};

/**
 * Update task
 *
 * @params id
 * @body title, description, priority, status
 *
 * @returns {updatedTask}
 */
export const updateTaskHandler = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title } = req.body;

    const doesTaskExist = await Task.findById(taskId);

    if (!doesTaskExist) {
      return res.status(404).json({
        message: "Task not found.",
        status: constants.STATUS_CODE.FAIL,
        error: true,
        data: {},
      });
    }

    const taskExitsWithSameTitle = await Task.findOne({
      title,
      _id: { $ne: taskId },
    });

    if (taskExitsWithSameTitle) {
      return res.status(400).json({
        message:
          "The task title you have entered is already in use. Please choose a unique title for your task.",
        status: constants.STATUS_CODE.FAIL,
        error: true,
        data: {},
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      { _id: taskId },
      req.body,
      { new: true }
    );

    return res.status(200).send({
      message: "User updated successfully.",
      status: constants.STATUS_CODE.SUCCESS,
      error: false,
      data: updatedTask,
    });
  } catch (error) {
    console.log("Error while updating tasks", error);

    return res.status(500).send({
      status: constants.STATUS_CODE.FAIL,
      message: "Something went wrong",
      error: true,
      data: {},
    });
  }
};

/**
 * Get all tasks
 *
 * @params search, sortBy, page, limit
 *
 * @returns { tasks }
 */
export const getTaskListHandler = async (req, res) => {
  try {
    const search = req.query.search ? req.query.search : "";

    const sortBy = req.query.sortBy;

    let field, value;
    if (sortBy) {
      const parts = sortBy.split(":");
      field = parts[0];
      parts[1] === "desc" ? (value = -1) : (value = 1);
    } else {
      (field = "createdAt"), (value = 1);
    }

    const pageOptions = {
      page: parseInt(req.query.page) || constants.PAGE,
      limit: parseInt(req.query.limit) || constants.LIMIT,
    };
    let page = pageOptions.page;
    let limit = pageOptions.limit;

    const query = search
      ? {
          $or: [{ title: new RegExp(search, "i") }],
        }
      : {};

    query.userId = req.user.id;

    let total = await Task.countDocuments(query);

    const tasks = await Task.find(query)
      .sort({ [field]: value })
      .skip((page - 1) * limit)
      .limit(limit)
      .collation({ locale: "en" });

    return res.status(200).send({
      message: "Tasks fetched successfully.",
      status: constants.STATUS_CODE.SUCCESS,
      error: false,
      data: { tasks, page, limit, total },
    });
  } catch (error) {
    console.log("Error while getting tasks", error);

    return res.status(500).send({
      status: constants.STATUS_CODE.FAIL,
      message: "Something went wrong",
      error: true,
      data: {},
    });
  }
};

/**
 * Delete task
 *
 * @params id
 *
 * @returns {}
 */
export const deleteTaskHandler = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
        status: constants.STATUS_CODE.FAIL,
        error: true,
        data: {},
      });
    }

    return res.status(200).send({
      message: "Task deleted successfully.",
      status: constants.STATUS_CODE.SUCCESS,
      error: false,
      data: {},
    });
  } catch (error) {
    console.log("Error while deleting tasks", error);

    return res.status(500).send({
      status: constants.STATUS_CODE.FAIL,
      message: "Something went wrong",
      error: true,
      data: {},
    });
  }
};

/**
 * Get task
 *
 * @params id
 *
 * @returns {}
 */
export const getTaskDetailsHandler = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
        status: constants.STATUS_CODE.FAIL,
        error: true,
        data: {},
      });
    }

    return res.status(200).send({
      message: "Task details fetched successfully.",
      status: constants.STATUS_CODE.SUCCESS,
      error: false,
      data: task,
    });
  } catch (error) {
    console.log("Error while deleting tasks", error);

    return res.status(500).send({
      status: constants.STATUS_CODE.FAIL,
      message: "Something went wrong",
      error: true,
      data: {},
    });
  }
};
