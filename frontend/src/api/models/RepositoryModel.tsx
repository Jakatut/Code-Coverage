import { Tree, TreeNodeInfo } from '@blueprintjs/core'
import { ContextMenu2 } from '@blueprintjs/popover2'
import { POPOVER2_CONTENT_SIZING } from '@blueprintjs/popover2/lib/esm/classes'
import { NodePath } from 'context/actions/RepositoryActions'

export enum ItemType {
	Directory = 'DIRECTORY',
	File = 'FILE',
}

export interface Repository {
	name: string;
	items: RepositoryItem[]|null;
}

export interface RepositoryItem {
    id: number;
	path: string;
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
export const Folder = (id: number, open: boolean, path: string, children: TreeNodeInfo[]):TreeNodeInfo => {
    return {
        id: id,
        label: (
            <>
            {path}
            <ContextMenu2 {...contentSizing} content={<></>} key={id}>
            </ContextMenu2>
            </>
        ),
        hasCaret: HasChildren(children),
        icon: (!HasChildren(children) && open) ? 'folder-open' : 'folder-close',
        childNodes: children,
        isExpanded: open,
        nodeData: {path, type: ItemType.Directory}
    }
}

// Create a "file" tree node which contains a file name and path.
export const File = (id: number, path: string):TreeNodeInfo => {
    let pathParts = path.split("/")
    return {
        id: id,
        label: pathParts[pathParts.length - 1],
        nodeData: {path, type: ItemType.File},
        icon: "document",
    }
}

// Converts a RepositoryItem to a TreeNodeInfo in the form of a folder or a file.
export const RepositoryItemToTreeNodeInfo = (item: RepositoryItem): TreeNodeInfo => {
    if (item.type === ItemType.Directory) {
        return Folder(item.id, true, item.path + "/", item.children ? item.children.map((child): TreeNodeInfo => {
            return RepositoryItemToTreeNodeInfo(child);
        }) : []);
    } else if (item.type === ItemType.File){
        return File(item.id, item.path); 
    }

    return {id: item.id, label: item.path}
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
