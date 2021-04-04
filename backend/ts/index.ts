import express from "express";
import login from "./api/login";
import session from "express-session";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 8000;

if (!process.env.SESSION_KEY) process.env.SESSION_KEY = "ouh2981w1pjd9";
// throw Error("SESSION_KEY is undefined");

app.use(
  session({ secret: process.env.SESSION_KEY, cookie: { maxAge: 60000 } })
);
app.use("/", express.static("./public"));

app.get("/favicon.ico", (req, res) =>
  res.redirect("https://lukesmith.xyz/favicon.ico")
);
app.post("/login", (req, res) => login(req, res));

app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
