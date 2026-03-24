import express from "express";
import { bootstrap } from "./config/bootstrap";


async function startCommitScripApp() { 

    try{
        const app = express(); 

        bootstrap(app); 

        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    } catch(e){
        console.log("Unable to boot strap server", e);
    } 
}

startCommitScripApp();
