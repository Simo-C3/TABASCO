import type { Context } from 'hono';

export interface Summary {
	title: string;
	text: string;
}

export interface SummaryResult {
	text: string;
}

export interface SummaryRepositoryInterface {
	summary(c: Context, data: Summary): Promise<SummaryResult>;
}
