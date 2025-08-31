import { GroupsConfig, GroupName, AggregatedResult } from "./types";

const CONFIG_KEY = "config";

export async function readGroupsConfig(kv: KVNamespace, envVars: Record<string, string>): Promise<GroupsConfig> {
	const viaKv = await kv.get(CONFIG_KEY, { type: "json" }) as GroupsConfig | null;
	if (viaKv && typeof viaKv === "object") return normalizeConfig(viaKv);
	if (envVars.GROUPS_JSON) {
		try {
			const parsed = JSON.parse(envVars.GROUPS_JSON) as GroupsConfig;
			return normalizeConfig(parsed);
		} catch {
			// ignore
		}
	}
	return {};
}

export async function writeGroupsConfig(kv: KVNamespace, config: GroupsConfig): Promise<void> {
	await kv.put(CONFIG_KEY, JSON.stringify(normalizeConfig(config)));
}

export function listGroups(config: GroupsConfig): GroupName[] {
	return Object.keys(config);
}

function normalizeConfig(config: GroupsConfig): GroupsConfig {
	const out: GroupsConfig = {};
	for (const [group, urls] of Object.entries(config)) {
		if (!urls || !Array.isArray(urls)) continue;
		const cleaned = urls
			.map(u => (typeof u === "string" ? u.trim() : ""))
			.filter(Boolean);
		if (cleaned.length > 0) out[group] = cleaned;
	}
	return out;
}

function groupCacheKey(group: GroupName): string {
	return `group:${group}`;
}

export async function getGroupCache(kv: KVNamespace, group: GroupName): Promise<AggregatedResult | null> {
	const cached = await kv.get(groupCacheKey(group), { type: "json" });
	return (cached as AggregatedResult | null) ?? null;
}

export async function setGroupCache(kv: KVNamespace, group: GroupName, result: AggregatedResult, ttlSeconds: number): Promise<void> {
	await kv.put(groupCacheKey(group), JSON.stringify(result), { expirationTtl: ttlSeconds });
}
