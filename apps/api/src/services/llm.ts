import axios from "axios";

const OLLAMA_HOST = process.env.OLLAMA_URL || "http://localhost:11434";

export async function generate(prompt:string){
    const res = await axios.post(`${OLLAMA_HOST}/api/generate`, {
        model: "llama3",
        prompt,
        stream: false
    })

    return res.data.response;
}
