import serverless from "serverless-http";
import app from "../src/App.js";
import ConnectDb from "../src/database/index.js";

// Connect to MongoDB once per cold-start
ConnectDb();

const handler = serverless(app);

export default function (req, res) {
  return handler(req, res);
}
