import { useEffect, useState } from 'react';
import axios from "axios";
import './App.css'

type Status = 'CHECKING_JWT' | 'NEEDS_GITHUB_AUTH' | 'GITHUB_AUTHED' | 'USER_LOADED';

axios.defaults.withCredentials = true;

function App() {

    const [appStatus, setAppStatus] = useState<Status>('CHECKING_JWT');
    const [user, setUser] = useState();

    const validateUser = async () => {
        try{
            const [userPromise] = await Promise.all([
                axios.get("http://localhost:3000/auth/validate"),
            ]);
            setUser(userPromise.data.user);
            setAppStatus("USER_LOADED");
        } catch(e){
            setAppStatus("NEEDS_GITHUB_AUTH");
        } 
    }
    /*
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
    */
    useEffect(() => {
        console.log(appStatus);
        if(appStatus === "CHECKING_JWT"){
            validateUser();
        } 
    }, [appStatus]);

    useEffect(() => {
        console.log(user);
    }, [user])

    const authenticate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        window.location.href = "http://localhost:3000/auth/";
    }

    return (
        <>
            <button onClick={authenticate}>Start auth flow</button>
            {user && <>User loaded</>}
        </>
    )
}

export default App
