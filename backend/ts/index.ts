import express from "express";
import login from "./api/login";
import session from "express-session";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 8000;

if (!process.env.SESSION_KEY)
  throw Error("SESSION_KEY is undefined");

app.use(session({ secret: process.env.SESSION_KEY, cookie: { maxAge: 60000 } }))
app.use("/", express.static("./public"));

app.get("/favicon.ico", (req, res) => res.redirect("https://lukesmith.xyz/favicon.ico"));
app.get("/blank", (req, res) => res.send(""));
app.post("/login", (req, res, next) => login(req, res));

app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
