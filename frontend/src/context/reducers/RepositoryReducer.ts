import { Tree, TreeNodeInfo } from '@blueprintjs/core';
import RepositoryActions, { RepositoryTypes, RepositoryPayload } from 'context/actions/RepositoryActions';
import { RepositoryState } from 'context/initial_states/RepositoryInitialState';
import { cloneDeep } from "lodash";
import RepositoryModel, { item_data, item_type, RepositoryItem } from 'api/models/RepositoryModel';
import { mainModule } from 'process';

type NodePath = number[]


const forEachNode = (nodes: TreeNodeInfo[] | undefined, callback: (node: TreeNodeInfo) => void) => {
    if (nodes === undefined) {
        return;
    }

    for (const node of nodes) {
        callback(node);
        forEachNode(node.childNodes, callback);
    }
}

const forNodeAtPath = (nodes: TreeNodeInfo[], path: NodePath, callback: (node: TreeNodeInfo) => void) => {
    callback(Tree.nodeFromPath(path, nodes));
}

const RepositoryReducer = (state: RepositoryState, action: RepositoryActions): RepositoryState => {
    const deselectAll = (): RepositoryState => {
        const newState = cloneDeep(state);
        forEachNode(newState.query_results ?? newState.tree, node => (node.isSelected = false));
        return newState;
    };

    const setIsExpanded = ({path, isExpanded}: RepositoryPayload[RepositoryTypes.Expand]): RepositoryState => {
        const newState = cloneDeep(state);
        forNodeAtPath(newState.query_results ?? newState.tree, path, node => (node.isExpanded = isExpanded));
        return newState;
    };

    const setIsSelected = ({path, isSelected}: RepositoryPayload[RepositoryTypes.Select]): RepositoryState => {
        const newState = cloneDeep(state);
        forNodeAtPath(newState.query_results ?? newState.tree, path, node => (node.isSelected = isSelected));
        return newState
    };
    
    const updateRepository = ({name, repo}: RepositoryPayload[RepositoryTypes.Update]): RepositoryState => {
        const tree = repo.items!.map((item: RepositoryItem): TreeNodeInfo => {
            return RepositoryModel.RepositoryItemToTreeNodeInfo(item, repo.name);
        });
        return {...state, name, tree}
	};

    const searchRepository = ({query}: RepositoryPayload[RepositoryTypes.Search]) => {
        const newState = cloneDeep(state);
        if (query.length === 0) {
            newState.query_results = null
            return newState
        }
        newState.query_results = [];
        let found_ids: number[] = []
        forEachNode(newState.tree, (node) => {
            if ((node.nodeData as item_data).name.includes(query)) {
                if (!found_ids.includes(node.id as number)) {
                    if ((node.nodeData as item_data).type === item_type.Directory ) {
                        node.isExpanded = true;
                        // Don't display the same file if the parent is found.
                        forEachNode(node.childNodes, (child) => {
                            found_ids.push(child.id as number);
                        })
                    }
                    node.isSelected = true;
                    newState.query_results?.push(node)
                    found_ids.push(node.id as number);
                }
            }
        });
        return newState;
    };

	switch (action.type) {
        case RepositoryTypes.DeselectAll:
            return deselectAll();
        case RepositoryTypes.Expand:
            return setIsExpanded(action.payload)
        case RepositoryTypes.Select:
            return setIsSelected(action.payload);
		case RepositoryTypes.Update:
			return updateRepository(action.payload);
        case RepositoryTypes.Search:
            return searchRepository(action.payload);
		default:
			return state;
	}
};

export default RepositoryReducer;
