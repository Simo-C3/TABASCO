import { Summary, SummaryRepositoryInterface, SummaryResult } from '../../domain/interface/summary';

class SummaryRepository implements SummaryRepositoryInterface {
	async summary(data: Summary): Promise<SummaryResult> {
		// TODO: OpenAPIのAPI叩く
		return { text: 'hoge' };
	}
}

const _summaryRepository = new SummaryRepository();
export default _summaryRepository;
