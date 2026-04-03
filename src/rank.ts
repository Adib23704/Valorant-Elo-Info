const VALORANT_API_URL = "https://valorant-api.com/v1/competitivetiers";

export type TierMap = Record<number, string>;

export interface RankInfo {
	playerName: string;
	rankName: string;
	rr: number;
	elo: number;
	tier: number;
}

interface CompetitiveTierEntry {
	tier: number;
	tierName: string;
}

interface CompetitiveTierSeason {
	tiers: CompetitiveTierEntry[];
}

interface CompetitiveTiersResponse {
	data: CompetitiveTierSeason[];
}

export async function fetchTierNames(): Promise<TierMap> {
	const response = await fetch(VALORANT_API_URL);
	if (!response.ok) {
		throw new Error(
			"Failed to fetch competitive tier data from valorant-api.com",
		);
	}

	const data = (await response.json()) as CompetitiveTiersResponse;
	const seasons = data.data;

	const latestSeason = seasons[seasons.length - 1];
	const tierMap: TierMap = {};

	for (const tier of latestSeason.tiers) {
		tierMap[tier.tier] = tier.tierName;
	}

	return tierMap;
}

export function calculateElo(tier: number, rr: number): number {
	return tier * 100 - 300 + rr;
}

export function formatRankInfo(
	tier: number,
	rr: number,
	tierNames: TierMap,
	playerName: string,
): RankInfo {
	const rankName = tierNames[tier] || `Unknown (Tier ${tier})`;
	const elo = calculateElo(tier, rr);

	return {
		playerName,
		rankName,
		rr,
		elo,
		tier,
	};
}
