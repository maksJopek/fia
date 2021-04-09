import express from "express";
import session from "express-session";
import * as dotenv from "dotenv";

import login from "./api/login";
import startPoint from "./api/startPoint";
import readyStateToggle from "./api/readyStateToggle";

dotenv.config();
const app = express();
const PORT = 8000;

if (!process.env.SESSION_KEY)
  throw Error("SESSION_KEY is undefined");

app.use(session({ secret: process.env.SESSION_KEY, cookie: { maxAge: 60000 } }));
app.use(express.json());
app.use("/", express.static("./public"));

app.get("/favicon.ico", (req, res) => res.redirect("https://lukesmith.xyz/favicon.ico"));

app.get("/startPoint", startPoint)

app.post("/login", login);
app.post("/readyStateToggle", readyStateToggle);


app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
