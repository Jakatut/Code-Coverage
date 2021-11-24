import { Repository } from 'api/models/RepositoryModel';

// This will let us access each payload member within the reducers.
type ActionMap<M extends { [index: string]: any }> = {
	[Key in keyof M]: M[Key] extends undefined
		? {
				type: Key;
		  }
		: {
				type: Key;
				payload: M[Key];
		  };
};

export type NodePath = number[];

export enum RepositoryTypes {
	Update = 'UPDATE_REPOSITORY',
	Search = 'SEARCH_REPOSITORY',
	Expand = 'SET_IS_EXPANDED',
    DeselectAll = 'DESELECT_ALL',
    Select = 'SET_IS_SELECTED',
    SetRepos = 'SET_REPOS',
}

// The parameters of the repository reducer params
export interface RepositoryPayload {
	[RepositoryTypes.Update]: {
        name: string;
        repo: Repository;
    };
	[RepositoryTypes.Search]: {
        query: string;
    };
    [RepositoryTypes.Expand]: {
        path: NodePath;
        isExpanded: boolean;
    };
    [RepositoryTypes.DeselectAll]: {};
    [RepositoryTypes.Select]: {
        path: NodePath;
        isSelected: boolean;
    };
    [RepositoryTypes.SetRepos]: {
        repos: string[];
    }
};

// Define the actions with the payload parameters. 
type RepositoryActions = ActionMap<RepositoryPayload>[keyof ActionMap<RepositoryPayload>];

export default RepositoryActions