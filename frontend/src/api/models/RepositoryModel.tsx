import { Tree, TreeNodeInfo } from '@blueprintjs/core'
import { ContextMenu2 } from '@blueprintjs/popover2'
import { POPOVER2_CONTENT_SIZING } from '@blueprintjs/popover2/lib/esm/classes'
import { NodePath } from 'context/actions/RepositoryActions'
import { forEachChild } from 'typescript'

export enum ItemType {
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
	type: ItemType;
	children: RepositoryItem[]|null;
}

export interface ItemData {
    path: string;
    type: ItemType;
    name: string;
}

export const contentSizing = { popoverProps: { popoverClassName: POPOVER2_CONTENT_SIZING } };

export const ForEachNode = (nodes: TreeNodeInfo[] | undefined, callback: (node: TreeNodeInfo) => void) => {
    if (nodes === undefined) {
        return;
    }

    for (const node of nodes) {
        callback(node);
        ForEachNode(node.childNodes, callback);
    }
}

export const ForNodeAtPath = (nodes: TreeNodeInfo[], path: NodePath, callback: (node: TreeNodeInfo) => void) => {
    callback(Tree.nodeFromPath(path, nodes));
}

// Checks if children are present.
export const HasChildren = (children: TreeNodeInfo[]|null): boolean => {
    return children !== null && children.length > 0
}

// Create a "folder" tree node which may contain 0 or more child "folder" or "file" repo items.
export const Folder = (id: number, open: boolean, name: string, path: string, children: TreeNodeInfo[]):TreeNodeInfo => {
    return {
        id: id,
        label: (
            <>
            {name}
            <ContextMenu2 {...contentSizing} content={<></>} key={id}>
            </ContextMenu2>
            </>
        ),
        hasCaret: HasChildren(children),
        icon: (!HasChildren(children) && open) ? 'folder-open' : 'folder-close',
        childNodes: children,
        isExpanded: open,
        nodeData: {path, type: ItemType.Directory, name}
    }
}

// Create a "file" tree node which contains a file name and path.
export const File = (id: number, name: string, path: string):TreeNodeInfo => {
    return {
        id: id,
        label: name,
        nodeData: {path, type: ItemType.File, name},
        icon: "document",
    }
}

// Converts a RepositoryItem to a TreeNodeInfo in the form of a folder or a file.
export const RepositoryItemToTreeNodeInfo = (item: RepositoryItem, path: string): TreeNodeInfo => {
    if (item.type === ItemType.Directory) {
        return Folder(item.id, true, item.name, path + "/" + item.name, item.children ? item.children.map((child): TreeNodeInfo => {
            return RepositoryItemToTreeNodeInfo(child, path + "/" + item.name);
        }) : []);
    } else if (item.type === ItemType.File){
        return File(item.id, item.name, path + "/" + item.name); 
    }

    return {id: item.id, label: item.name}
}

export const CountNodes = (start: TreeNodeInfo[]|undefined):number => {
    let nodeCount: number = 0;
    ForEachNode(start, () => {
        nodeCount += 1;
    });

    return nodeCount;
}


const RepositoryModel = {
    RepositoryItemToTreeNodeInfo,
    Folder,
    File,
}

export default RepositoryModel;
