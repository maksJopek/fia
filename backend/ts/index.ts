import express from "express";
import session from "express-session";
import * as dotenv from "dotenv";

import login from "./api/login";
import startPoint from "./api/startPoint";
import readyStateToggle from "./api/readyStateToggle";
import getCurrentGameState from "./api/getCurrentGameState";
import saveGameBoard from "./api/saveGameBoard";

export const global = { stop: false };

dotenv.config();
const app = express();
const PORT = 8000;

if (!process.env.SESSION_KEY)
  throw Error("SESSION_KEY is undefined");

app.use(session({
  secret: process.env.SESSION_KEY,
  saveUninitialized: true,
  resave: true,
  cookie: {
    expires: new Date(Date.now() + 3600000),
  }
}));
app.use(express.json());
app.use("/", express.static("./public"));

app.get("/favicon.ico", (req, res) => res.redirect("https://lukesmith.xyz/favicon.ico"));

app.get("/startPoint", startPoint)

app.post("/login", login);
app.post("/readyStateToggle", readyStateToggle);
app.post("/getCurrentGameState", getCurrentGameState);
app.post("/saveGameBoard", saveGameBoard);


app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
