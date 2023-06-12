import type { Context } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import type { Share, ShareRepositoryInterface } from '../../domain/interface/share';
import type { ShareID } from '../../types/share';

type Env = {
	DB: D1Database;
};

interface GetResult {
	title: string;
	pageTitle: string;
	url: string;
}

class ShareRepository implements ShareRepositoryInterface {
	async get(c: Context<{ Bindings: Env }>, id: ShareID): Promise<Share> {
		const SELECT =
			'SELECT s.title as title, u.title as pageTitle, u.url as url FROM shares as s JOIN urls as u ON s.id = u.share_id WHERE s.id = ?';
		const res = await c.env.DB.prepare(SELECT).bind(id).all<GetResult>();

		const pages = res.results?.map((page) => {
			return { title: page.pageTitle, url: page.url };
		});
		if (res.results?.length == 0) {
			c.status(400);
			return { title: 'not found', pages: [] };
		}
		const result: Share = {
			title: res.results![0].title,
			pages: pages || [],
		};
		return result;
	}

	async create(c: Context<{ Bindings: Env }>, data: Share): Promise<ShareID> {
		const uuid = uuidv4();
		await c.env.DB.prepare('INSERT INTO shares(id, title) VALUES(?,?);').bind(uuid, data.title).run();
		for (const page of data.pages) {
			await c.env.DB.prepare('INSERT INTO urls(title, url, share_id) VALUES(?, ?, ?);').bind(page.title, page.url, uuid).run();
		}
		return uuid;
	}
}

const _shareRepository = new ShareRepository();
export default _shareRepository;
