import type { Summary, SummaryRepositoryInterface, SummaryResult } from '../domain/interface/summary';
import type { Context } from 'hono';

export class SummaryService {
	private readonly _repositoryInterface: SummaryRepositoryInterface;
	constructor(repositoryInterface: SummaryRepositoryInterface) {
		this._repositoryInterface = repositoryInterface;
	}

	async summary(c: Context, data: Summary): Promise<SummaryResult> {
		return await this._repositoryInterface.summary(c, data);
	}
}
