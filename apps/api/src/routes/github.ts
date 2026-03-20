import { Router } from "express";
import dotenv from "dotenv";
import axios from "axios";

const router = Router();

dotenv.config();

const AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.NODE_GITHUB_CLIENT_ID}&scope=repo,user`;

router.get("/github", (_, res) => {
    res.redirect(AUTH_URL);
})

router.get("/github/callback", async (req, res) => {
    const {code} = req.query;

    try{
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.NODE_GITHUB_CLIENT_ID,
                client_secret: process.env.NODE_GITHUB_CLIENT_SECRET,
                code
            },
            {
                headers: {accept: 'application/json'}
            }
        );

        const accessToken = tokenResponse.data.access_token;
        console.log(accessToken);

        const userResponse = await axios.get("https://api.github.com/user",
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );

        const user = userResponse.data;

        console.log('Authenticated Github User:', user);

        res.json({message: 'User authorized', user});
    } catch (error:unknown){
        console.error("Oauth Error:", error.response?.data || error.message);
        res.status(500).json({error: 'Authentication failed'});
    }
})

export default router;
