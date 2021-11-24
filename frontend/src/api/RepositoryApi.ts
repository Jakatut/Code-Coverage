import { Repositories, Repository, RepositoryItem } from './models/RepositoryModel';

const baseUrl = "http://localhost:3001/api"

export const GetRepository = (name: string): Promise<Repository> => {
    return fetch(`${baseUrl}/repository/${name}`, {method: "GET"})
        .then(response => response.json())
};

export const GetRepositoryItem = (name: string, path: string): Promise<RepositoryItem> => {
        return fetch(`${baseUrl}/repository/${name}?path=${path}`, {method: "GET"})
            .then(response => response.json())
};

export const GetRepositories = (): Promise<Repositories> => {
	return fetch(`${baseUrl}/repository`, {method: "GET"})
        .then(response => response.json()) as Promise<Repositories>
}

const RepositoryApi = {
	GetRepository,
	GetRepositories,
        GetRepositoryItem,
};

export default RepositoryApi;
