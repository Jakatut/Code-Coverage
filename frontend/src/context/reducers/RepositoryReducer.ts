import { Tree, TreeNodeInfo } from '@blueprintjs/core';
import RepositoryActions, { RepositoryTypes } from 'context/actions/RepositoryActions';
import { RepositoryState } from 'context/initial_states/RepositoryInitialState';
import { cloneDeep } from "lodash";

function forEachNode(nodes: TreeNodeInfo[] | undefined, callback: (node: TreeNodeInfo) => void) {
    if (nodes === undefined) {
        return;
    }

    for (const node of nodes) {
        callback(node);
        forEachNode(node.childNodes, callback);
    }
}

type NodePath = number[]

function forNodeAtPath(nodes: TreeNodeInfo[], path: NodePath, callback: (node: TreeNodeInfo) => void) {
    callback(Tree.nodeFromPath(path, nodes));
}

const RepositoryReducer = (state: RepositoryState, action: RepositoryActions) => {
    const deselectAll = (payload: any) => {
        const newState = cloneDeep(state);
        forEachNode(newState.tree, node => (node.isSelected = false));
        return newState;
    };

    const setIsExpanded = (payload: any) => {
        console.log(payload);
        const newState = cloneDeep(state);
        forNodeAtPath(newState.tree, payload.path, node => (node.isExpanded = payload.isExpanded));
        return newState;
    };

    const setIsSelected = (payload: any) => {
        const newState = cloneDeep(state);
        forNodeAtPath(newState.tree, payload.path, node => (node.isSelected = payload.isSelected));
        return newState
    };
    
    const updateRepository = (payload: any) => {
		return {
			...state,
		};
	};

    const searchRepository = (payload: any) => {
        return {
            ...state,
        };
    };

	switch (action.type) {
        case RepositoryTypes.DeselectAll:
            return deselectAll(action.payload);
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
