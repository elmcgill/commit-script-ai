import express from "express";
import generateRoute from "./routes/generate";
import githubRoutes from "./routes/github";

const app = express();

app.use(express.json());

app.use("/api/generate", generateRoute)
app.use("/auth", githubRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
