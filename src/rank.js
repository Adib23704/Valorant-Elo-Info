const VALORANT_API_URL = "https://valorant-api.com/v1/competitivetiers";

export async function fetchTierNames() {
  const response = await fetch(VALORANT_API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch competitive tier data from valorant-api.com");
  }

  const data = await response.json();
  const seasons = data.data;

  const latestSeason = seasons[seasons.length - 1];
  const tierMap = {};

  for (const tier of latestSeason.tiers) {
    tierMap[tier.tier] = tier.tierName;
  }

  return tierMap;
}

export function calculateElo(tier, rr) {
  return tier * 100 - 300 + rr;
}

export function formatRankInfo(tier, rr, tierNames) {
  const rankName = tierNames[tier] || `Unknown (Tier ${tier})`;
  const elo = calculateElo(tier, rr);

  return {
    rankName,
    rr,
    elo,
    tier,
  };
}
