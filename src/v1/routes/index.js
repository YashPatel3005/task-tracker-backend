import express from "express";
import user from "./user.route.js";
import tasks from "./task.route.js";

const router = express.Router();

router.use("/api/user", user);

router.use("/api/tasks", tasks);

export default router;
