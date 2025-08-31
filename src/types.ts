export interface Env {
	FEEDS_KV: KVNamespace;
	ADMIN_TOKEN: string;
	CORS_ALLOW_ORIGIN: string;
	CACHE_TTL_SECONDS: string;
	FETCH_TIMEOUT_MS: string;
	CONCURRENCY: string;
	USER_AGENT: string;
	GROUPS_JSON: string;
	CONFIG_URL: string;
}

export type GroupName = string;

export interface GroupsConfig {
	[groupName: GroupName]: string[];
}

export interface FeedItem {
	id: string;
	title: string;
	link: string;
	author?: string;
	publishedAt?: string;
	updatedAt?: string;
	summary?: string;
	sourceUrl: string;
}

export interface AggregatedResult {
	group: GroupName;
	items: FeedItem[];
	generatedAt: string;
	limit: number;
}
