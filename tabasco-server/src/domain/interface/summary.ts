export interface Summary {
	title: string;
	text: string;
}

export interface SummaryResult {
	text: string;
}

export interface SummaryRepositoryInterface {
	summary(data: Summary): Promise<SummaryResult>;
}
