import express from "express";
import sqlite3 from "sqlite3";
import generateRoute from "./routes/generate";
import githubRoutes from "./routes/github";

const db = new sqlite3.Database("commit_script.db");

const app = express();

app.use(express.json());

app.use("/api/generate", generateRoute)
app.use("/auth", githubRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
