import React from 'react';
import { Classes, TreeNodeInfo, Tree } from "@blueprintjs/core";
import { useRepositoryDispatch, useRepositoryState } from 'context/providers/RepositoryProvider';
import { NodePath, RepositoryTypes } from 'context/actions/RepositoryActions';
import SearchBar from 'components/SearchBar';
import RepositoryList from 'pages/repository/RepositoryList';
import { ItemData, ItemType } from 'api/models/RepositoryModel';
import { useNavigate } from 'react-router';

const Repository = () => {

    const navigate = useNavigate();
    const repositoryState = useRepositoryState();
    const repositoryDispatcher = useRepositoryDispatch();

    // Open a directory or select a file in the repository. If it's a file, go to the coverage.
    const handleNodeClick = React.useCallback(
        (node: TreeNodeInfo, nodePath: NodePath, e: React.MouseEvent<HTMLElement>) => {
            if ((node.nodeData as ItemData).type === ItemType.Directory) {
                repositoryDispatcher({
                    payload: { path: nodePath, isExpanded: true },
                    type: RepositoryTypes.Expand,
                });
            } else {
                repositoryDispatcher({
                    payload: { path: nodePath, isSelected: true },
                    type: RepositoryTypes.Select,
                });
                navigate("/coverage")
            }
    },[navigate, repositoryDispatcher]);

    // Collapse directories.
    const handleNodeCollapse = React.useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
        if ((_node.nodeData as ItemData).type === ItemType.Directory) {
            repositoryDispatcher({
                payload: { path: nodePath, isExpanded: false },
                type: RepositoryTypes.Expand,
            });
        }
    }, [repositoryDispatcher]);

    // Expand directories.
    const handleNodeExpand = React.useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
        if ((_node.nodeData as ItemData).type === ItemType.Directory) {
            repositoryDispatcher({
                payload: { path: nodePath, isExpanded: true },
                type: RepositoryTypes.Expand,
            });
        }
    }, [repositoryDispatcher]);

    return (
        <div>
            <RepositoryList></RepositoryList>
            <div style={{ width: "20%", height: "50%", position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
                <SearchBar hint={'Search Files...'}></SearchBar>
                <div style={{height: "20px", borderLeft: "solid 1px red", borderRight: "solid 1px red"}}>
                    <b>{repositoryState.name.toUpperCase()}</b>
                </div>
                <div style={{ border: "solid 1px black", display: "flex", justifyContent: "center", alignItems: "center", listStyle: "none"}}>
                    <Tree
                        contents={repositoryState.query_results.tree ?? repositoryState.tree} // use query results first if available.
                        onNodeClick={handleNodeClick}
                        onNodeCollapse={handleNodeCollapse}
                        onNodeExpand={handleNodeExpand}
                        className={Classes.ELEVATION_0}
                    />
                </div>
            </div>
        </div>
    )
};

export default Repository