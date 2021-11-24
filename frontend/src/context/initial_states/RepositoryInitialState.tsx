import { TreeNodeInfo } from '@blueprintjs/core'

const tree: TreeNodeInfo[] = [];

export interface QueryResult {
    tree: TreeNodeInfo[]|undefined;
    count: number;
}

export interface RepositoryState {
    name: string;
    query: string;
    query_results: QueryResult;
    tree: TreeNodeInfo[];
    repos: string[];
    file_path: string|undefined;
}

const RepositoryInitialState = {
    name: "Default Repository",
    query: "",
    tree: tree,
    query_results: {
        tree: undefined,
        count: 0,
    },
    repos: [],
    file_path: undefined
}

export default RepositoryInitialState;