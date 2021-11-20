import React, { useCallback, useEffect, useState } from 'react';
import RepositoryInterface from 'interfaces/RepositoryInterface';
import { Classes, Icon, Intent, TreeNodeInfo, Tree } from "@blueprintjs/core";
import { useRepositoryDispatch, useRepositoryState } from 'context/providers/RepositoryProvider';
import { RepositoryTypes } from 'context/actions/RepositoryActions';
import { Example } from '@blueprintjs/docs-theme';

type NodePath = number[];


const Repository = ({ name }: RepositoryInterface) => {

    const repositoryState = useRepositoryState();
    const repositoryDispatcher = useRepositoryDispatch();

    const handleNodeClick = React.useCallback(
        (node: TreeNodeInfo, nodePath: NodePath, e: React.MouseEvent<HTMLElement>) => {
            console.log("hii!");
            const originallySelected = node.isSelected;
            if (!e.shiftKey) {
                repositoryDispatcher.dispatch({ type: RepositoryTypes.DeselectAll, payload: {} });
            }
            repositoryDispatcher.dispatch({
                payload: { path: nodePath, isSelected: originallySelected == null ? true : !originallySelected },
                type: RepositoryTypes.Select
            });
    },[repositoryDispatcher]);

    const handleNodeCollapse = React.useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
        repositoryDispatcher.dispatch({
            payload: { path: nodePath, isExpanded: false },
            type: RepositoryTypes.Expand,
        });
    }, [repositoryDispatcher]);

    const handleNodeExpand = React.useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
        repositoryDispatcher.dispatch({
            payload: { path: nodePath, isExpanded: true },
            type: RepositoryTypes.Expand,
        });
    }, [repositoryDispatcher]);

    return (
        <Example options={false}>
            <Tree
                contents={repositoryState.state.tree}
                onNodeClick={handleNodeClick}
                onNodeCollapse={handleNodeCollapse}
                onNodeExpand={handleNodeExpand}
                className={Classes.ELEVATION_0}
            />
        </Example>
    )
};

export default Repository