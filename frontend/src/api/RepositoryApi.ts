import axios from 'axios';
import { ItemType, Repository } from 'api/models/RepositoryModel';

export const GetRepository = (name: string): Repository => {
	return {
		name,
		items: [
			{
                id: 0,
				name: 'dir1',
				type: ItemType.Directory,
				children: [
					{
                        id: 1,
						name: 'file1.txt',
						type: ItemType.File,
						children: null,
					},
					{
                        id: 2,
						name: 'dir2',
						type: ItemType.Directory,
						children: [
							{
								id: 3,
								name: "file2.txt",
								type: ItemType.File,
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
