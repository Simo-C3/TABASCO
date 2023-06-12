import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { ShareController } from '../controller/share';
import _shareRepository from '../repository/d1/share';

type Env = {
	DB: D1Database;
};

const share = new Hono<{ Bindings: Env }>();

share.get('/:id', async (c) => {
	const controller = new ShareController(_shareRepository);
	const id = Number(c.req.param('id'));
	const result = await controller.get(c, id);
	return c.json(result);
});

const schema = z.object({
	title: z.string({ required_error: 'Title is required' }),
	pages: z.array(
		z.object({
			title: z.string({ required_error: 'page title is required' }),
			url: z.string({ required_error: 'page url is required' }),
		})
	),
});

share.post('/', zValidator('json', schema), async (c) => {
	const controller = new ShareController(_shareRepository);
	const data = c.req.valid('json');
	const result = await controller.create(c, data);
	return c.json(result);
});

export default share;
