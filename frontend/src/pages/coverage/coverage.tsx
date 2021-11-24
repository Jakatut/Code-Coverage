import CoverageApi from 'api/CoverageApi';
import { useRepositoryState } from 'context/providers/RepositoryProvider'
import { useEffect, useState } from 'react';

const Coverage = () => {

    const repositoryState = useRepositoryState();
    const [coverage, setCoverage] = useState<number>(0.0)

    useEffect(() => {
        // If a file path has been selected, get it's total coverage.
        if (repositoryState.file_path !== undefined) {
            CoverageApi.GetCoverage(repositoryState.name, repositoryState.file_path, (coverage: number) => {
                console.log(coverage)
                setCoverage(coverage)
            })
        }
    })

    return (
        <div style={{ width: "50%", height: "50%", position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
            <div style={{width: "100%", border: "solid 1px black", position: "fixed"}}>
                <b>{repositoryState.file_path}</b> <b>{coverage}</b>
                <ul>
                </ul>
            </div>
        </div>
    )
}

export default Coverage