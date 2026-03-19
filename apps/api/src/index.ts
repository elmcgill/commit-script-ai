import express from "express";

const app = express();

app.use(express.json());

app.post("/api/generate", (req, res) => {
  res.json({ message: "API is working" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
