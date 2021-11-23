import axios from 'axios';
import { ItemType, Repository } from 'api/models/RepositoryModel';

export const GetRepository = (name: string): Repository => {
	return {
		name: "hclsyntax",
		items: [
			{
				id: 1,
				path: "hclsyntax",
				type: ItemType.Directory,
				children: [
					{
						id: 1,
						path: "hclsyntax/parser.go",
						type: ItemType.File,
						children: null
					},
					{
						id: 2,
						path: "hclsyntax/peeker.go",
						type: ItemType.File,
						children: null
					},
					{
						id: 3,
						path: "hclsyntax/public.go",
						type: ItemType.File,
						children: null
					},
					{
						id: 3,
						path: "hclsyntax/token.go",
						type: ItemType.File,
						children: null
					}
				]
			}
		]
	};
};

const GetRepositories = () => {
	return ["hclsyntax", "golang-tools"]
}

const RepositoryApi = {
	GetRepository,
	GetRepositories,
};

export default RepositoryApi;
