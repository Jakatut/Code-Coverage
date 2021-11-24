import { Repositories, Repository } from 'api/models/RepositoryModel';
import RepositoryApi from 'api/RepositoryApi';
import { RepositoryTypes } from 'context/actions/RepositoryActions';
import { useRepositoryDispatch, useRepositoryState } from 'context/providers/RepositoryProvider'
import { useEffect } from "react"


const RepositoryList = () => {

    const repositoryState = useRepositoryState();
    const repositoryDispatch = useRepositoryDispatch();

    const onRepoClick = (name: string) => {
        // Change the current repo in view.
        RepositoryApi.GetRepository(name).then((repo: Repository) => {
            repositoryDispatch({type: RepositoryTypes.Update, payload: {name, repo}})
        }).catch(() => {console.error("Could not get repository.")});
    }

    // Creates a new repo item in the list.
    const repoItem = (name: string) => {
        return <li onClick={() => onRepoClick(name)} key={name}><b>{name}</b></li>
    }

    useEffect(() => {
        // Get the list of repos
        RepositoryApi.GetRepositories().then((repos: Repositories) => {
            let names: string[] = []
            repos.repositories.forEach((repo: Repository) => {names.push(repo.name)})
            repositoryDispatch({type: RepositoryTypes.SetRepos, payload: { repos: names }})
        }).catch(() => {console.error("Could not get repositories")});
    }, [repositoryDispatch])

    return (
        <div style={{width: "10%", border: "solid 1px black", position: "fixed"}}>
            <b>REPOSITORIES</b>
            <ul>
                {repositoryState.repos.map((repo: string) => {
                    return repoItem(repo)
                })}
            </ul>
        </div>
    )
}

export default RepositoryList