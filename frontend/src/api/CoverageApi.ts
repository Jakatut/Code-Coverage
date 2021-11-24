import axios from 'axios';
const baseUrl = "http://localhost:3001"

export const GetCoverage = (repositoryName: string, filePath: string, callback: Function) => {
    axios.get(`${baseUrl}/repository/${repositoryName}?path=${filePath}`)
        .then((response) => {
            callback(response.data.covered_percentage as number)
        }).catch(error => {
            console.error(error)
        }) 
};

const CoverageApi = {
    GetCoverage,
}

export default CoverageApi;