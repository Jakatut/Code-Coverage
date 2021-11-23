import { TreeNodeInfo } from '@blueprintjs/core'
import { ContextMenu2 } from '@blueprintjs/popover2';
import { contentSizing } from 'api/models/RepositoryModel';

const tree: TreeNodeInfo[] = [
    {
        id: 0,
        hasCaret: true,
        isExpanded: true,
        icon: "folder-open",
        label: (
            <>
            src
            <ContextMenu2 {...contentSizing} content={<div>Hello there!</div>} >
            </ContextMenu2>
            </>
        ),
        childNodes: [
            {
                id: 4,
                icon: "document",
                label: "file1.txt",
            },
        ]
    },
    {
        id: 1,
        icon: "folder-close",
        isExpanded: true,
        label: (
            <>
            bin
            <ContextMenu2 {...contentSizing} content={<div>Hello there!</div>}>
            </ContextMenu2>
            </>
        ),
        childNodes: [
            {
                id: 2,
                icon: "document",
                label: "Item 0",
            },
        ],
    },
];

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
}

export default RepositoryInitialState;