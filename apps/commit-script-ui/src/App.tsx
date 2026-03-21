import { useEffect, useState } from 'react';
import axios from "axios";
import'./App.css'

type Status = 'CHECKING_JWT' | 'NEEDS_GITHUB_AUTH' | 'GITHUB_AUTHED' | 'USER_LOADED';

axios.defaults.withCredentials = true;

function App() {

    const [appStatus, setAppStatus] = useState<Status>('CHECKING_JWT');
    const [user, setUser] = useState();
    const [repositories, setRepositories] = useState();
    const [selectedRepository, setSelectedRepository] = useState();

    const decodeUserFromJWT = async () => {
        try{
            const [userPromise, reposPromise] = await Promise.all([
                axios.get("http://localhost:3000/auth/decode"),
                axios.get("http://localhost:3000/auth/github/repositories")
            ]);
            setUser(userPromise.data.user);
            setRepositories(reposPromise.data.repositories);
            setSelectedRepository(reposPromise.data.repositories[0]);
            setAppStatus("USER_LOADED");
        } catch(e){
            setAppStatus("NEEDS_GITHUB_AUTH");
        } 
    }
  
    const updateSelectedRepository = (e:React.ChangeEvent<HTMLSelectElement>) => {
        e.stopPropagation();
        const id = e.currentTarget.value;
        const repository = repositories.find((repo) => repo.id === id)[0];
        setSelectedRepository(repository);
    }

    const cloneRepositoryAndFetchPRs = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        console.log("load repository into LLM context, and pull PRs to start generating content");
    }

    useEffect(() => {
        console.log(appStatus);
        if(appStatus === "CHECKING_JWT"){
            decodeUserFromJWT();
        } 
    }, [appStatus]);

    console.log(user?.username);
    console.log(repositories);
    console.log(selectedRepository);

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
                    {(!user && !repositories) ?
                        <button onClick={authenticate}>Start auth flow</button>
                        :
                        <div>
                            <img src={user.avatar} alt={"Github user avatar"} style={{width: '40px', height: '40px', objectFit: 'cover'}}/>
                            <h2>{user.username}</h2>
                            <h2>Select repository to work with</h2>
                            <select onChange={updateSelectedRepository}>
                                {repositories.map((opt) => (
                                    <option id={opt.id} key={opt.id} value={opt.id}>{opt.name}</option>
                                ))}
                            </select>
                            <button onClick={cloneRepositoryAndFetchPRs}>Load Repository</button>
                        </div>
                    }
                </>
            }
        </>
    )
}

export default App
