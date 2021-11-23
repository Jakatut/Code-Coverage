import RepositoryApi from 'api/RepositoryApi';
import { RepositoryTypes } from 'context/actions/RepositoryActions';
import { useRepositoryDispatch, useRepositoryState } from 'context/providers/RepositoryProvider'
import React, { useEffect } from "react"


const RepositoryList = () => {

    const repositoryState = useRepositoryState();
    const repositoryDispatch = useRepositoryDispatch();

    const onRepoClick = (name: string) => {
        let repo = RepositoryApi.GetRepository(name)
        repositoryDispatch({type: RepositoryTypes.Update, payload: {name, repo }})
    }

    const repoItem = (name: string) => {
        return <li onClick={() => onRepoClick(name)} key={name}><b>{name}</b></li>
    }

    useEffect(() => {
        let repos = RepositoryApi.GetRepositories()
        repositoryDispatch({type: RepositoryTypes.SetRepos, payload: {repos}})
    }, [])

    return (
        <div style={{height: "80%", borderLeft: "solid 1px black", borderRight: "solid 1px black"}}>
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