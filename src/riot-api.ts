// --- Local API types ---

interface RiotSession {
	puuid: string;
	region: string;
}

interface EntitlementsResponse {
	accessToken: string;
	token: string;
}

interface PresenceEntry {
	puuid: string;
	product: string;
	private: string | null;
}

interface PresencesResponse {
	presences: PresenceEntry[];
}

interface PresenceData {
	playerPresenceData?: {
		competitiveTier?: number;
		accountLevel?: number;
	};
	partyPresenceData?: {
		partyClientVersion?: string;
	};
}

// --- Remote API types ---

interface SeasonalInfo {
	CompetitiveTier: number;
	RankedRating: number;
}

interface CompetitiveSkill {
	SeasonalInfoBySeasonID: Record<string, SeasonalInfo> | null;
}

interface QueueSkills {
	competitive?: CompetitiveSkill;
}

interface MmrResponse {
	QueueSkills?: QueueSkills;
}

// --- Exports ---

export interface RankData {
	tier: number;
	rr: number;
}

export interface RiotContext {
	puuid: string;
	region: string;
	accessToken: string;
	entitlementsToken: string;
	clientVersion: string;
	presenceTier: number;
}

// --- Region to shard mapping ---

const REGION_TO_SHARD: Record<string, string> = {
	na: "na",
	latam: "na",
	br: "na",
	sa3: "na",
	eu: "eu",
	ap: "ap",
	kr: "kr",
};

const CLIENT_PLATFORM =
	"ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQxLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9";

// --- Local API helpers ---

function buildLocalAuthHeader(password: string): string {
	const encoded = Buffer.from(`riot:${password}`).toString("base64");
	return `Basic ${encoded}`;
}

async function localGet<T>(
	port: number,
	password: string,
	endpoint: string,
): Promise<T> {
	const url = `https://127.0.0.1:${port}${endpoint}`;
	const response = await fetch(url, {
		headers: { Authorization: buildLocalAuthHeader(password) },
	});

	if (!response.ok) {
		throw new Error(
			`Could not connect to Riot Client. Make sure Valorant is open.`,
		);
	}

	return response.json() as Promise<T>;
}

// --- Public API ---

export async function fetchRiotContext(
	port: number,
	password: string,
): Promise<RiotContext> {
	// Fetch session, tokens, and presences in parallel
	const [session, entitlements, presencesRes] = await Promise.all([
		localGet<RiotSession>(port, password, "/chat/v1/session"),
		localGet<EntitlementsResponse>(port, password, "/entitlements/v1/token"),
		localGet<PresencesResponse>(port, password, "/chat/v4/presences"),
	]);

	// Decode our Valorant presence for client version + current tier
	let clientVersion = "";
	let presenceTier = 0;

	const ourPresence = presencesRes.presences.find(
		(p) => p.puuid === session.puuid && p.product === "valorant",
	);

	if (ourPresence?.private) {
		const decoded = JSON.parse(
			Buffer.from(ourPresence.private, "base64").toString("utf-8"),
		) as PresenceData;

		clientVersion = decoded.partyPresenceData?.partyClientVersion ?? "";
		presenceTier = decoded.playerPresenceData?.competitiveTier ?? 0;
	}

	return {
		puuid: session.puuid,
		region: session.region,
		accessToken: entitlements.accessToken,
		entitlementsToken: entitlements.token,
		clientVersion,
		presenceTier,
	};
}

export async function fetchRankData(ctx: RiotContext): Promise<RankData> {
	const shard = REGION_TO_SHARD[ctx.region] ?? "na";
	const url = `https://pd.${shard}.a.pvp.net/mmr/v1/players/${ctx.puuid}`;

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${ctx.accessToken}`,
			"X-Riot-Entitlements-JWT": ctx.entitlementsToken,
			"X-Riot-ClientPlatform": CLIENT_PLATFORM,
			"X-Riot-ClientVersion": ctx.clientVersion,
		},
	});

	if (!response.ok) {
		// Fall back to presence tier if remote API fails
		return { tier: ctx.presenceTier, rr: 0 };
	}

	const mmr = (await response.json()) as MmrResponse;
	const seasonal = mmr.QueueSkills?.competitive?.SeasonalInfoBySeasonID;

	if (!seasonal) {
		// No competitive data — use presence tier
		return { tier: ctx.presenceTier, rr: 0 };
	}

	// Find the most recent season entry (highest tier or most recent)
	let bestTier = 0;
	let bestRr = 0;

	for (const info of Object.values(seasonal)) {
		if (info.CompetitiveTier > bestTier) {
			bestTier = info.CompetitiveTier;
			bestRr = info.RankedRating;
		}
	}

	// If MMR data found, use it; otherwise fall back to presence
	if (bestTier > 0) {
		return { tier: bestTier, rr: bestRr };
	}

	return { tier: ctx.presenceTier, rr: 0 };
}
