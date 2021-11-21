import React, { useEffect } from 'react';
import { Classes, TreeNodeInfo, Tree } from "@blueprintjs/core";
import { useRepositoryDispatch, useRepositoryState } from 'context/providers/RepositoryProvider';
import { NodePath, RepositoryTypes } from 'context/actions/RepositoryActions';
import RepositoryApi from 'api/RepositoryApi';
import SearchBar from 'components/SearchBar';

const Repository = () => {

    const repositoryState = useRepositoryState();
    const repositoryDispatcher = useRepositoryDispatch();

    const handleNodeClick = React.useCallback(
        (node: TreeNodeInfo, nodePath: NodePath, e: React.MouseEvent<HTMLElement>) => {
            const originallySelected = node.isSelected;
            if (!e.shiftKey) {
                repositoryDispatcher({ type: RepositoryTypes.DeselectAll, payload: {} });
            }
            repositoryDispatcher({
                payload: { path: nodePath, isSelected: originallySelected == null ? true : !originallySelected },
                type: RepositoryTypes.Select
            });
    },[]);

    const handleNodeCollapse = React.useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
        repositoryDispatcher({
            payload: { path: nodePath, isExpanded: false },
            type: RepositoryTypes.Expand,
        });
    }, []);

    const handleNodeExpand = React.useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
        repositoryDispatcher({
            payload: { path: nodePath, isExpanded: true },
            type: RepositoryTypes.Expand,
        });
    }, []);

    useEffect(() => {
        const repo = RepositoryApi.GetRepository("repo1");
        repositoryDispatcher({type: RepositoryTypes.Update, payload: {name: "repo1", repo}})
        console.log(repositoryState.query_results)
    }, [])

    return (
        <>
        <SearchBar></SearchBar>
        <Tree
            contents={repositoryState.query_results ?? repositoryState.tree}
            onNodeClick={handleNodeClick}
            onNodeCollapse={handleNodeCollapse}
            onNodeExpand={handleNodeExpand}
            className={Classes.ELEVATION_0}
        />
        </>
    )
};

export default Repository