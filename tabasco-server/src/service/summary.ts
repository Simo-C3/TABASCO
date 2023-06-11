import { Summary, SummaryRepositoryInterface, SummaryResult } from '../domain/interface/summary';

export class SummaryService {
	private readonly _repositoryInterface: SummaryRepositoryInterface;
	constructor(repositoryInterface: SummaryRepositoryInterface) {
		this._repositoryInterface = repositoryInterface;
	}

	async summary(data: Summary): Promise<SummaryResult> {
		return await this._repositoryInterface.summary(data);
	}
}
