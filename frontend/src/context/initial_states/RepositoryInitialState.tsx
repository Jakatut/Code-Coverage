import { TreeNodeInfo } from '@blueprintjs/core'

const tree: TreeNodeInfo[] = [];

export interface QueryResult {
    tree: TreeNodeInfo[]|undefined;
    count: number;
}

export interface RepositoryState {
    name: string;
    query: string;
    queryResults: QueryResult;
    tree: TreeNodeInfo[];
    repos: string[];
    filePath: string|undefined;
}

const RepositoryInitialState = {
    name: "",
    query: "",
    tree: tree,
    queryResults: {
        tree: undefined,
        count: 0,
    },
    repos: [],
    filePath: undefined
}

export default RepositoryInitialState;