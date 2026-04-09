import axios from "axios";
import { IOllamaService } from "./types.services";

export function OllamaService():IOllamaService {

    const OLLAMA_HOST = process.env.NODE_OLLAMA_HOST;

    const askOllama = async (prompt: string, model: string): Promise<string> => {
        const body = {
            model,
            prompt,
            stream: false
        };
        const res = await axios.post(`http://${OLLAMA_HOST}:11434/api/generate`, JSON.stringify(body), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.data) throw new Error("No response body");

        const reader = res.data;
        /*
        const decoder = new TextDecoder();

        let result = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n").filter(Boolean);

            for (const line of lines) {
                try {
                    const parsed = JSON.parse(line);
                    console.log(parsed);
                    if (parsed.response) {
                        process.stdout.write(parsed.response);
                        result += parsed.response;
                    }
                } catch(e) {
                    console.log(e);
                }
            }
        }
        */
        return "";
    }

    return {
        askOllama
    }

}
