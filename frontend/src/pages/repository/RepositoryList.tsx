import RepositoryApi from 'api/RepositoryApi';
import { RepositoryTypes } from 'context/actions/RepositoryActions';
import { useRepositoryDispatch, useRepositoryState } from 'context/providers/RepositoryProvider'
import React, { useEffect } from "react"


const RepositoryList = () => {

    const repositoryState = useRepositoryState();
    const repositoryDispatch = useRepositoryDispatch();

    const onRepoClick = (name: string) => {
        let repo = RepositoryApi.GetRepository(name)
        repositoryDispatch({type: RepositoryTypes.Update, payload: {name, repo}})
    }

    const repoItem = (name: string) => {
        return <li onClick={() => onRepoClick(name)} key={name}><b>{name}</b></li>
    }

    useEffect(() => {
        let repos = RepositoryApi.GetRepositories()
        repositoryDispatch({type: RepositoryTypes.SetRepos, payload: {repos}})
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