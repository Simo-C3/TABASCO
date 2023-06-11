import type { Context } from 'hono';
import type { SummaryRepositoryInterface } from '../domain/interface/summary';
import { SummaryService } from '../service/summary';

interface SummaryRequest {
	title: string;
	text: string;
}

interface SummaryResponse {
	text: string;
}

export class SummaryController {
	private readonly service: SummaryService;

	constructor(repositoryInterface: SummaryRepositoryInterface) {
		this.service = new SummaryService(repositoryInterface);
	}

	async summary(c: Context, data: SummaryRequest): Promise<SummaryResponse> {
		return await this.service.summary(c, data);
	}
}
