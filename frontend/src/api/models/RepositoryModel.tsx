import { Tree, TreeNode, TreeNodeInfo } from '@blueprintjs/core'
import { ContextMenu2 } from '@blueprintjs/popover2'
import { POPOVER2_CONTENT_SIZING } from '@blueprintjs/popover2/lib/esm/classes'
import { ExecOptionsWithStringEncoding } from 'child_process'
import { identity } from 'lodash'

export enum item_type {
	Directory = 'DIRECTORY',
	File = 'FILE',
}

export type Repository = {
	name: string;
	items: RepositoryItem[]|null;
}

export type RepositoryItem = {
    id: number;
	name: string;
	type: item_type;
	children: RepositoryItem[]|null;
}

export interface item_data {
    path: string;
    type: item_type;
    name: string;
}

export const contentSizing = { popoverProps: { popoverClassName: POPOVER2_CONTENT_SIZING } };

// Checks if children are present.
const hasChildren = (children: TreeNodeInfo[]|null): boolean => {
    return children !== null && children.length > 0
}

// Create a "folder" tree node which may contain 0 or more child "folder" or "file" repo items.
export const folder = (id: number, open: boolean, name: string, path: string, children: TreeNodeInfo[]):TreeNodeInfo => {
    return {
        id: id,
        label: (
            <>
            {name}
            <ContextMenu2 {...contentSizing} content={<></>} key={id}>
            </ContextMenu2>
            </>
        ),
        hasCaret: hasChildren(children),
        icon: (!hasChildren(children) && open) ? 'folder-open' : 'folder-close',
        childNodes: children,
        isExpanded: open,
        nodeData: {path, type: item_type.Directory, name}
    }
}

// Create a "file" tree node which contains a file name and path.
export const file = (id: number, name: string, path: string):TreeNodeInfo => {
    return {
        id: id,
        label: name,
        nodeData: {path, type: item_type.File, name},
        icon: "document",
    }
}

// Converts a RepositoryItem to a TreeNodeInfo in the form of a folder or a file.
export const RepositoryItemToTreeNodeInfo = (item: RepositoryItem, path: string): TreeNodeInfo => {
    if (item.type === item_type.Directory) {
        return folder(item.id, true, item.name, path + "/" + item.name, item.children ? item.children.map((child): TreeNodeInfo => {
            return RepositoryItemToTreeNodeInfo(child, item.name);
        }) : []);
    } else if (item.type === item_type.File){
        return file(item.id, item.name, path + "/" + item.name); 
    }

    return {id: item.id, label: item.name}
}


const RepositoryModel = {
    RepositoryItemToTreeNodeInfo,
    folder,
    file,
}

export default RepositoryModel;
