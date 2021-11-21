import axios from 'axios';
import { item_type, Repository } from 'api/models/RepositoryModel';

export const GetRepository = (name: string): Repository => {
	return {
		name,
		items: [
			{
                id: 0,
				name: 'dir1',
				type: item_type.Directory,
				children: [
					{
                        id: 1,
						name: 'file1.txt',
						type: item_type.File,
						children: null,
					},
					{
                        id: 2,
						name: 'dir2',
						type: item_type.Directory,
						children: [
							{
								id: 3,
								name: "file2.txt",
								type: item_type.File,
								children: null
							}
						],
					},
				],
			},
		],
	};
};

const RepositoryApi = {
	GetRepository,
};

export default RepositoryApi;
