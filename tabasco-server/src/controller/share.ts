import { Context } from 'hono';
import { ShareRepositoryInterface } from '../domain/interface/share';
import { ShareService } from '../service/share';
import { ShareID } from '../types/share';

interface Page {
	title: string;
	url: string;
}

interface CreateShareRequest {
	title: string;
	pages: Page[];
}

interface CreateShareResponse {
	id: ShareID;
}

interface GetShareResponse {
	title: string;
	pages: Page[];
}

export class ShareController {
	private readonly service: ShareService;
	constructor(shareRepository: ShareRepositoryInterface) {
		this.service = new ShareService(shareRepository);
	}

	async get(c: Context, id: ShareID): Promise<GetShareResponse> {
		return await this.service.get(c, id);
	}

	async create(c: Context, data: CreateShareRequest): Promise<CreateShareResponse> {
		const id = await this.service.create(c, data);
		const response: CreateShareResponse = {
			id: id,
		};
		return response;
	}
}
