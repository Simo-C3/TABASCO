import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import type { Context } from 'hono';
import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_ENGINE } from '../../config/openai';
import type { Summary, SummaryRepositoryInterface, SummaryResult } from '../../domain/interface/summary';

class SummaryRepository implements SummaryRepositoryInterface {
	private convertContent(data: Summary): string {
		const content = `summarize this in about 200 characters in Japanese. title：${data.title}, body:${data.text}`;
		return content;
	}

	async summary(c: Context, data: Summary): Promise<SummaryResult> {
		if (!(c.env.OPENAI_API_KEY && c.env.OPENAI_ORGANIZATION && c.env.IS_ENABLE_OPENAI)) {
			throw new Error('environment variable is not found');
		}

		if (c.env.IS_ENABLE_OPENAI === 'false') {
			c.status(503);
			return { text: 'summary is not enable now.' };
		}

		const configure = new Configuration({
			organization: c.env.OPENAI_ORGANIZATION,
			apiKey: c.env.OPENAI_API_KEY,
			baseOptions: {
				adapter: fetchAdapter,
			},
		});
		const openai = new OpenAIApi(configure);

		const result = await openai.createChatCompletion({
			model: OPENAI_ENGINE,
			messages: [
				{
					role: 'user',
					content: this.convertContent(data),
				},
			],
		});

		return { text: result.data.choices[0].message?.content ?? '' };
	}
}

const _summaryRepository = new SummaryRepository();
export default _summaryRepository;
