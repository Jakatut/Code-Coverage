import { Coverage } from 'api/models/CoverageModel';
const baseUrl = "http://localhost:3001/api"

export const GetCoverage = (repositoryName: string, filePath: string): Promise<Coverage> => {
    return fetch(`${baseUrl}/repository/${repositoryName}/coverage?path=${filePath}`, {method: "GET"})
        .then((response) => response.json())
};

const CoverageApi = {
    GetCoverage,
}

export default CoverageApi;