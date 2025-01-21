import express from "express";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";

import router from "./v1/routes/index.js";

const port = process.env.PORT;
const app = express();

// To connect with database
import connectToDb from "./db/mongoose.js";
connectToDb();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// version v1
app.use("/v1", router);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
