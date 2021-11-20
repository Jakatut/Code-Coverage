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

export enum RepositoryTypes {
	Update = 'UPDATE_REPOSITORY',
	Search = 'DELETE_PRODUCT',
	Expand = 'SET_IS_EXPANDED',
    DeselectAll = 'DESELECT_ALL',
    Select = 'SET_IS_SELECTED',
}

type RepositoryPayload = {
	[RepositoryTypes.Update]: {
        name: string;
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
        path: NodePath; isSelected: boolean;
    }
};

type RepositoryActions = ActionMap<RepositoryPayload>[keyof ActionMap<RepositoryPayload>];
export type NodePath = number[];

export default RepositoryActions