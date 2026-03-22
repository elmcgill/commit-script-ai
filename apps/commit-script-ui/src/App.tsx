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
    const [pullRequests, setPullRequests] = useState();
    const [selectedPullRequest, setSelectedPullRequest] = useState();

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
        const repository = repositories.find((repo) => repo.id === +id);
        setSelectedRepository(repository);
    }

    const fetchPRs = async (e:React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const repositoryName = selectedRepository?.name;
        if(repositoryName){
            const res = await axios.get(`http://localhost:3000/auth/github/pullRequests?repository=${repositoryName}`);
            const pullRequests = res.data;
            setPullRequests(pullRequests.pullRequests);
            if(pullRequests?.length > 0) setSelectedPullRequest(pullRequests[0]);
        }
    }

    const updateSelectedPullRequest = (e:React.ChangeEvent<HTMLSelectElement>) => {
        e.stopPropagation();
        const id = e.currentTarget.value;
        const pullRequest = pullRequests.find((pr) => pr.id === + id);
        setSelectedPullRequest(pullRequest);
    }

    const reviewPullRequest = async (e:React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const res = await axios.post('http://localhost:3000/auth/github/filesAndDiff', {
            repository: selectedRepository.name,
            pullRequest: selectedPullRequest
        });
        console.log(res.data);
    }

    useEffect(() => {
        console.log(appStatus);
        if(appStatus === "CHECKING_JWT"){
            decodeUserFromJWT();
        } 
    }, [appStatus]);

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
                            <button onClick={fetchPRs}>Load Repository</button>
                        </div>
                    }
                    {pullRequests && pullRequests.length > 0 &&
                        <>
                            <p>Select Pull Request to continue</p>
                            <select onChange={updateSelectedPullRequest}>
                                {pullRequests.map((pr) => (
                                    <option id={pr.id} key={pr.id} value={pr.id}>{pr.title}</option>
                                ))}
                            </select>
                            <button onClick={reviewPullRequest}>Start PR Review</button>
                        </>
                    }
                </>

            }
        </>
    )
}

export default App
