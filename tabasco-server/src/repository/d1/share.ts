import type { Context } from 'hono';
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
		const result: Share = {
			title: res.results![0].title || 'undefined',
			pages: pages || [],
		};
		return result;
	}

	async create(c: Context<{ Bindings: Env }>, data: Share): Promise<ShareID> {
		const result = await c.env.DB.prepare('INSERT INTO shares(title) VALUES(?);').bind(data.title).run();
		const id = result.meta.last_row_id;
		data.pages.forEach((page) => {
			c.env.DB.prepare('INSERT INTO urls(title, url, share_id) VALUES(?, ?, ?);').bind(page.title, page.url, id).run();
		});
		return id;
	}
}

const _shareRepository = new ShareRepository();
export default _shareRepository;
