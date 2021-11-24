import CoverageApi from 'api/CoverageApi';
import { useRepositoryState } from 'context/providers/RepositoryProvider'
import { useEffect, useState } from 'react';

const Coverage = () => {

    const repositoryState = useRepositoryState();
    const [coverage, setCoverage] = useState<number>(0.0)

    useEffect(() => {
        if (repositoryState.filePath !== undefined) {
            CoverageApi.GetCoverage(repositoryState.name, repositoryState.filePath, (coverage: number) => {
                setCoverage(coverage)
            })
        }
    }, [])

    return (
        <div style={{ width: "50%", height: "50%", position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
            <div style={{width: "100%", border: "solid 1px black", position: "fixed"}}>
                <b>{repositoryState.filePath}</b> <b>{coverage}</b>
                <ul>
                </ul>
            </div>
        </div>
    )
}

export default Coverage