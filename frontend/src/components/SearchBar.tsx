import React from 'react';
import { Icon, InputGroup, Tag } from '@blueprintjs/core';
import { useRepositoryDispatch, useRepositoryState } from 'context/providers/RepositoryProvider';
import { RepositoryTypes } from 'context/actions/RepositoryActions';



const resultsTag = (count: number) => {
    return (
        <Tag minimal={true}>{count}</Tag>
    )
};

const SearchBar = () => {

    const repositoryState = useRepositoryState();
    const repositoryDispatch = useRepositoryDispatch();
    console.log(repositoryState.query_results.tree)
	return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "solid 1px black", borderBottom: ""}}>
		<InputGroup
			large={true}
			leftElement={<Icon icon='search' />}
			onChange={(e) => {repositoryDispatch({type: RepositoryTypes.Search, payload: {query: e.target.value}})}}
			placeholder='Search Files...'
			rightElement={resultsTag(repositoryState.query_results.count)}
		/>
        </div>
	);
};

export default SearchBar;
