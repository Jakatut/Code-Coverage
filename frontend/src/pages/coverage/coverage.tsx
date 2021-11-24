import CoverageApi from 'api/CoverageApi';
import { Coverage } from 'api/models/CoverageModel';
import { RepositoryItem } from 'api/models/RepositoryModel';
import RepositoryApi from 'api/RepositoryApi';
import { useRepositoryState } from 'context/providers/RepositoryProvider'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const CodeCoverage = () => {

    const navigate = useNavigate()
    const repositoryState = useRepositoryState();
    const [coverage, setCoverage] = useState<number>(0.0)
    const [content, setContent] = useState<string[]>([])

    useEffect(() => {
        // If a file path has been selected, get it's total coverage.
        if (repositoryState.filePath !== undefined) {
            CoverageApi.GetCoverage(repositoryState.name, repositoryState.filePath).then((coverage: Coverage) => {
                setCoverage(coverage.covered_percentage)
            })
            
            RepositoryApi.GetRepositoryItem(repositoryState.name, repositoryState.filePath).then((item: RepositoryItem) => {
                setContent(item.content.split("\n"))
            })
        } else {
            navigate("/")
        }
    }, [repositoryState.filePath, repositoryState.name, navigate])

    return (
        <div style={{ width: "50%", height: "50%", position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
            <div style={{width: "100%", border: "solid 1px black", position: "fixed"}}>
                <div style={{display: "flex", justifyContent: "space-around"}}><b>{repositoryState.filePath}</b> <b>Coverage: {coverage * 100}%</b></div>
                <div style={{width: "100%", height: "100%", border: "solid 1px black", position: "fixed", overflow: "scroll"}}>
                    {content.map((line, i) => {
                        return <pre key={i}>{line}</pre>
                    })}
                </div>
            </div>
        </div>
    )
}

export default CodeCoverage