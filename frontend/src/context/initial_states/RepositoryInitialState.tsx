import { TreeNodeInfo } from '@blueprintjs/core'
import { ContextMenu2 } from '@blueprintjs/popover2';
import { contentSizing } from 'api/models/RepositoryModel';

const tree: TreeNodeInfo[] = [];

export type QueryResult = {
    tree: TreeNodeInfo[]|undefined;
    count: number;
}

export type RepositoryState = {
    name: string;
    query: string;
    query_results: QueryResult;
    tree: TreeNodeInfo[];
    repos: string[];
    filePath: string|undefined;
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
    filePath: undefined
}

export default RepositoryInitialState;