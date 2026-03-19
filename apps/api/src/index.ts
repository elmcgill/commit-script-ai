import axios from "axios";
import express from "express";

const app = express();

app.use(express.json());

const OLLAMA_HOST = "http://localhost:11434";

async function askOllama(prompt:string){
    const res = await axios.post(`${OLLAMA_HOST}/api/generate`, {
        model: "llama3",
        prompt,
        stream: false
    })

    return res.data.response;
}

app.post("/api/generate", async (req, res) => {
    const prompt = req.body.prompt;
    const ollamaResponse = await askOllama(prompt);
    res.json({ message: ollamaResponse });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
