import type { Context } from 'hono';
import { ShareID } from '../../types/share';

export interface Page {
	title: string;
	url: string;
}

export interface Share {
	title: string;
	pages: Page[];
}

export interface ShareRepositoryInterface {
	get(c: Context, id: ShareID): Promise<Share>;
	create(c: Context, data: Share): Promise<ShareID>;
}
