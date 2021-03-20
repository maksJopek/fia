import express from 'express';
import login from './api/login';
import * as dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 8000;

app.use("/", express.static("./public"));

app.get('/login', (req, res) => login(req, res));

app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});