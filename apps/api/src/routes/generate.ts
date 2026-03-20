import { Router } from "express";
import { generate } from "../services/llm";

const router = Router();

router.post("/", async(req,res) => {
    try {
        const {prompt} = req.body;

        if(!prompt) {
            res.status(400).json({error: "Prompt is required"});
        }

        const result = await generate(prompt);

        res.json({result});
    } catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to generate response"});
    }
})

export default router;
