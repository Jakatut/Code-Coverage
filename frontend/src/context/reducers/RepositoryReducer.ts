import { TreeNodeInfo } from '@blueprintjs/core';
import RepositoryActions, { RepositoryTypes, RepositoryPayload } from 'context/actions/RepositoryActions';
import { RepositoryState } from 'context/initial_states/RepositoryInitialState';
import { cloneDeep } from "lodash";
import RepositoryModel, { ForNodeAtPath, ForEachNode, ItemData, ItemType, RepositoryItem, CountNodes } from 'api/models/RepositoryModel';

const RepositoryReducer = (state: RepositoryState, action: RepositoryActions): RepositoryState => {
    const deselectAll = (): RepositoryState => {
        const newState = cloneDeep(state);
        ForEachNode(newState.queryResults.tree ?? newState.tree, node => (node.isSelected = false));
        return newState;
    };

    const setIsExpanded = ({path, isExpanded}: RepositoryPayload[RepositoryTypes.Expand]): RepositoryState => {
        const newState = cloneDeep(state);
        ForNodeAtPath(newState.queryResults.tree ?? newState.tree, path, node => (node.isExpanded = isExpanded));
        return newState;
    };

    const setIsSelected = ({path, isSelected}: RepositoryPayload[RepositoryTypes.Select]): RepositoryState => {
        const newState = cloneDeep(state);
        ForNodeAtPath(newState.queryResults.tree ?? newState.tree, path, (node) => {
            node.isSelected = isSelected
            newState.filePath = (node.nodeData as ItemData).path
        });
        return newState
    };
    
    const updateRepository = ({name, repo}: RepositoryPayload[RepositoryTypes.Update]): RepositoryState => {
        let tree = repo.items!.map((item: RepositoryItem): TreeNodeInfo => {
            return RepositoryModel.RepositoryItemToTreeNodeInfo(item);
        });
        let queryResults = state.queryResults;
        queryResults.tree = undefined
        queryResults.count = 0
        return {...state, name, tree, queryResults}
	};

    const searchRepository = ({query}: RepositoryPayload[RepositoryTypes.Search]) => {
        const newState = cloneDeep(state);
        if (query.length === 0) {
            newState.queryResults.tree = undefined
            newState.queryResults.count = CountNodes(newState.queryResults.tree)
            return newState
        }
        newState.queryResults.tree = [];
        let foundIds: number[] = []

        // Search the repository by the path query.
        // If the node's (file/directory) path includes the query, it may be apart of the search. 
        ForEachNode(newState.tree, (node) => {
            if ((node.nodeData as ItemData).path.includes(query)) {
                if (!foundIds.includes(node.id as number)) {
                    // Expand any directories that are within the query.
                    if ((node.nodeData as ItemData).type === ItemType.Directory ) {
                        node.isExpanded = true;
                    }
                    node.isSelected = true;
                    newState.queryResults.tree?.push(node)
                    foundIds.push(node.id as number);
                }
            }
        });

        newState.queryResults.count = CountNodes(newState.queryResults.tree)
        return newState;
    };

    const setRepos = ({repos}: RepositoryPayload[RepositoryTypes.SetRepos]) => {
        
        return {
            ...state,
            repos
        }
    }

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
        case RepositoryTypes.SetRepos:
            return setRepos(action.payload);
		default:
			return state;
	}
};

export default RepositoryReducer;
