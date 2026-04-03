interface RiotSession {
	puuid: string;
}

interface Season {
	ID: string;
	IsActive: boolean;
	Type: string;
}

interface ContentResponse {
	Seasons: Season[];
}

interface SeasonalInfo {
	CompetitiveTier: number;
	RankedRating: number;
}

interface CompetitiveSkill {
	SeasonalInfoBySeasonID: Record<string, SeasonalInfo>;
}

interface QueueSkills {
	competitive?: CompetitiveSkill;
}

interface MmrResponse {
	QueueSkills?: QueueSkills;
}

export interface RankData {
	tier: number;
	rr: number;
}

function buildAuthHeader(password: string): string {
	const encoded = Buffer.from(`riot:${password}`).toString("base64");
	return `Basic ${encoded}`;
}

async function riotGet<T>(port: number, password: string, endpoint: string): Promise<T> {
	const url = `https://127.0.0.1:${port}${endpoint}`;
	const response = await fetch(url, {
		headers: {
			Authorization: buildAuthHeader(password),
		},
	});

	if (!response.ok) {
		throw new Error(`Riot API returned ${response.status} for ${endpoint}`);
	}

	return response.json() as Promise<T>;
}

export async function fetchPuuid(port: number, password: string): Promise<string> {
	const session = await riotGet<RiotSession>(port, password, "/chat/v1/session");
	return session.puuid;
}

export async function fetchCurrentSeasonId(port: number, password: string): Promise<string> {
	const content = await riotGet<ContentResponse>(port, password, "/content-service/v3/content");

	const seasons = content.Seasons || [];
	const activeAct = seasons.find((s) => s.IsActive && s.Type === "act");

	if (!activeAct) {
		throw new Error("Could not determine the current competitive season.");
	}

	return activeAct.ID;
}

export async function fetchMmr(port: number, password: string, puuid: string): Promise<MmrResponse> {
	return riotGet<MmrResponse>(port, password, `/mmr/v1/players/${puuid}`);
}

export function extractRankData(mmrResponse: MmrResponse, seasonId: string): RankData {
	const competitive = mmrResponse?.QueueSkills?.competitive;
	if (!competitive) {
		return { tier: 0, rr: 0 };
	}

	const seasonalInfo = competitive.SeasonalInfoBySeasonID?.[seasonId];
	if (!seasonalInfo) {
		return { tier: 0, rr: 0 };
	}

	return {
		tier: seasonalInfo.CompetitiveTier || 0,
		rr: seasonalInfo.RankedRating || 0,
	};
}
