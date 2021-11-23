import { Tree, TreeNodeInfo } from '@blueprintjs/core';
import RepositoryActions, { RepositoryTypes, RepositoryPayload } from 'context/actions/RepositoryActions';
import { RepositoryState } from 'context/initial_states/RepositoryInitialState';
import { cloneDeep } from "lodash";
import RepositoryModel, { ForNodeAtPath, ForEachNode, ItemData, ItemType, RepositoryItem, CountNodes } from 'api/models/RepositoryModel';
import { mainModule } from 'process';

type NodePath = number[]

const RepositoryReducer = (state: RepositoryState, action: RepositoryActions): RepositoryState => {
    const deselectAll = (): RepositoryState => {
        const newState = cloneDeep(state);
        ForEachNode(newState.query_results.tree ?? newState.tree, node => (node.isSelected = false));
        return newState;
    };

    const setIsExpanded = ({path, isExpanded}: RepositoryPayload[RepositoryTypes.Expand]): RepositoryState => {
        const newState = cloneDeep(state);
        ForNodeAtPath(newState.query_results.tree ?? newState.tree, path, node => (node.isExpanded = isExpanded));
        return newState;
    };

    const setIsSelected = ({path, isSelected}: RepositoryPayload[RepositoryTypes.Select]): RepositoryState => {
        const newState = cloneDeep(state);
        ForNodeAtPath(newState.query_results.tree ?? newState.tree, path, node => (node.isSelected = isSelected));
        return newState
    };
    
    const updateRepository = ({name, repo}: RepositoryPayload[RepositoryTypes.Update]): RepositoryState => {
        const tree = repo.items!.map((item: RepositoryItem): TreeNodeInfo => {
            return RepositoryModel.RepositoryItemToTreeNodeInfo(item);
        });
        return {...state, name, tree}
	};

    const searchRepository = ({query}: RepositoryPayload[RepositoryTypes.Search]) => {
        const newState = cloneDeep(state);
        if (query.length === 0) {
            newState.query_results.tree = undefined
            return newState
        }
        newState.query_results.tree = [];
        let found_ids: number[] = []
        ForEachNode(newState.tree, (node) => {
            if ((node.nodeData as ItemData).path.includes(query)) {
                if (!found_ids.includes(node.id as number)) {
                    if ((node.nodeData as ItemData).type === ItemType.Directory ) {
                        node.isExpanded = true;
                        ForEachNode(node.childNodes, (child) => {
                            found_ids.push(child.id as number)
                        })
                    }
                    node.isSelected = true;
                    newState.query_results.tree?.push(node)
                    found_ids.push(node.id as number);
                }
            }
        });

        newState.query_results.count = CountNodes(newState.query_results.tree)
        
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
