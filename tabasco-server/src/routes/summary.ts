import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { SummaryController } from '../controller/summary';
import _summaryRepository from '../repository/openapi/summary';

const summary = new Hono();
const schema = z.object({
	title: z.string({ required_error: 'Title is required' }),
	text: z.string({ required_error: 'Text is required' }),
});

summary.post('/', zValidator('json', schema), async (c) => {
	const controller = new SummaryController(_summaryRepository);
	const body = await c.req.valid('json');
	const result = await controller.summary(body);
	return c.json(result);
});

export default summary;
