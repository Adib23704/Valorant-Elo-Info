const VALORANT_API_BASE = "https://valorant-api.com/v1";

export type TierMap = Record<number, string>;

export interface RankInfo {
	playerName: string;
	rankName: string;
	rr: number;
	elo: number;
	tier: number;
	peakRankName: string;
	peakRr: number;
	peakElo: number;
	peakTier: number;
}

export interface GameData {
	tierNames: TierMap;
	currentActId: string;
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

interface Season {
	uuid: string;
	displayName: string;
	type: string;
	startTime: string;
	endTime: string;
}

interface SeasonsResponse {
	data: Season[];
}

export async function fetchGameData(): Promise<GameData> {
	const [tiersRes, seasonsRes] = await Promise.all([
		fetch(`${VALORANT_API_BASE}/competitivetiers`),
		fetch(`${VALORANT_API_BASE}/seasons`),
	]);

	if (!tiersRes.ok || !seasonsRes.ok) {
		throw new Error("Failed to fetch data from valorant-api.com");
	}

	const tiersData = (await tiersRes.json()) as CompetitiveTiersResponse;
	const latestSeason = tiersData.data[tiersData.data.length - 1];
	const tierNames: TierMap = {};
	for (const tier of latestSeason.tiers) {
		tierNames[tier.tier] = tier.tierName;
	}

	const seasonsData = (await seasonsRes.json()) as SeasonsResponse;
	const now = new Date();
	const currentAct = seasonsData.data.find(
		(s) =>
			s.type === "EAresSeasonType::Act" &&
			new Date(s.startTime) <= now &&
			new Date(s.endTime) > now,
	);

	if (!currentAct) {
		throw new Error("Could not determine the current competitive act.");
	}

	return { tierNames, currentActId: currentAct.uuid };
}

export function calculateElo(tier: number, rr: number): number {
	return tier * 100 - 300 + rr;
}

export function formatRankInfo(
	tier: number,
	rr: number,
	peakTier: number,
	peakRr: number,
	tierNames: TierMap,
	playerName: string,
): RankInfo {
	const rankName = tierNames[tier] || `Unknown (Tier ${tier})`;
	const elo = calculateElo(tier, rr);
	const peakRankName = tierNames[peakTier] || `Unknown (Tier ${peakTier})`;
	const peakElo = calculateElo(peakTier, peakRr);

	return {
		playerName,
		rankName,
		rr,
		elo,
		tier,
		peakRankName,
		peakRr,
		peakElo,
		peakTier,
	};
}
