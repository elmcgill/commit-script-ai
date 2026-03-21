import { useEffect, useState } from 'react';
import axios from "axios";
import'./App.css'

type Status = 'CHECKING_JWT' | 'NEEDS_GITHUB_AUTH' | 'GITHUB_AUTHED' | 'USER_LOADED';

axios.defaults.withCredentials = true;

function App() {

    const [appStatus, setAppStatus] = useState<Status>('CHECKING_JWT');
    const [user, setUser] = useState();

    const decodeUserFromJWT = async () => {
        try{
            const res = await axios.get("http://localhost:3000/auth/decode")
            setUser(res.data.user);
            setAppStatus("USER_LOADED");
        } catch(e){
            setAppStatus("NEEDS_GITHUB_AUTH");
        } 
    }

   
    useEffect(() => {
        console.log(appStatus);
        if(appStatus === "CHECKING_JWT"){
            decodeUserFromJWT();
        } 
    }, [appStatus]);

    console.log(user?.username);

    const authenticate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        window.location.href = "http://localhost:3000/auth/github";
    }

    return (
        <>
            {appStatus === 'CHECKING_JWT' ?
                <>
                    Loading State...
                </>
                :
                <>
                    {!user ?
                        <button onClick={authenticate}>Start auth flow</button>
                        :
                        <div>
                            <img src={user.avatar} alt={"Github user avatar"} style={{width: '40px', height: '40px', objectFit: 'cover'}}/>
                            <h2>{user.username}</h2>
                        </div>
                    }
                </>
            }
        </>
    )
}

export default App
