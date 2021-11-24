import React, { useEffect } from 'react';
import { Classes, TreeNodeInfo, Tree } from "@blueprintjs/core";
import { useRepositoryDispatch, useRepositoryState } from 'context/providers/RepositoryProvider';
import { NodePath, RepositoryTypes } from 'context/actions/RepositoryActions';
import RepositoryApi from 'api/RepositoryApi';
import SearchBar from 'components/SearchBar';
import RepositoryList from 'pages/repository/RepositoryList';
import { ItemData, ItemType } from 'api/models/RepositoryModel';
import { useNavigate } from 'react-router';

const Repository = () => {

    const navigate = useNavigate();
    const repositoryState = useRepositoryState();
    const repositoryDispatcher = useRepositoryDispatch();

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

    // useEffect(() => {
    //     const repo = RepositoryApi.GetRepository(repositoryState.name);
    //     repositoryDispatcher({type: RepositoryTypes.Update, payload: {name: "hclsyntax", repo}})
    // }, [])

    return (
        <div>
        <RepositoryList></RepositoryList>
        <div style={{ width: "20%", height: "50%", position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
            <SearchBar hint={'Search Files...'}></SearchBar>
            <div style={{height: "20px", borderLeft: "solid 1px black", borderRight: "solid 1px black"}}>
                <b>{repositoryState.name.toUpperCase()}</b>
            </div>
            <div style={{ border: "solid 1px black", display: "flex", justifyContent: "center", alignItems: "center", listStyle: "none"}}>
                <Tree
                    contents={repositoryState.query_results.tree ?? repositoryState.tree}
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