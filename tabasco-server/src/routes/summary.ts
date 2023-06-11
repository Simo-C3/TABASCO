import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { SummaryController } from '../controller/summary';
import _summaryRepository from '../repository/openapi/summary';

type Bindings = {
	IS_ENABLE_OPENAI: 'true' | 'false';
	OPENAI_API_KEY: string;
	OPENAI_ORGANIZATION: string;
};

const summary = new Hono<{ Bindings: Bindings }>();
const schema = z.object({
	title: z.string({ required_error: 'Title is required' }),
	text: z.string({ required_error: 'Text is required' }),
});

summary.post('/', zValidator('json', schema), async (c) => {
	const controller = new SummaryController(_summaryRepository);
	const body = await c.req.valid('json');
	const result = await controller.summary(c, body);
	return c.json(result);
});

export default summary;
