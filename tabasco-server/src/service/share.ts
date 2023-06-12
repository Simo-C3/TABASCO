import type { Context } from 'hono';
import { Share, ShareRepositoryInterface } from '../domain/interface/share';
import type { ShareID } from '../types/share';

export class ShareService {
	private readonly shareRepositoryInterface: ShareRepositoryInterface;

	constructor(shareRepositoryInterface: ShareRepositoryInterface) {
		this.shareRepositoryInterface = shareRepositoryInterface;
	}

	async get(c: Context, id: ShareID): Promise<Share> {
		return await this.shareRepositoryInterface.get(c, id);
	}

	async create(c: Context, data: Share): Promise<ShareID> {
		return await this.shareRepositoryInterface.create(c, data);
	}
}
