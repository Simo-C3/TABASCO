import { Hono } from 'hono';
import { SummaryController } from '../controller/summary';
import _summaryRepository from '../repository/openapi/summary';

const summary = new Hono();

summary.post('/', async (c) => {
	const controller = new SummaryController(_summaryRepository);
	const body = await c.req.json();
	const result = await controller.summary(body);
	return c.json(result);
});

export default summary;
