function buildAuthHeader(password) {
  const encoded = Buffer.from(`riot:${password}`).toString("base64");
  return `Basic ${encoded}`;
}

async function riotGet(port, password, endpoint) {
  const url = `https://127.0.0.1:${port}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      Authorization: buildAuthHeader(password),
    },
  });

  if (!response.ok) {
    throw new Error(
      `Riot API returned ${response.status} for ${endpoint}`
    );
  }

  return response.json();
}

export async function fetchPuuid(port, password) {
  const session = await riotGet(port, password, "/chat/v1/session");
  return session.puuid;
}

export async function fetchCurrentSeasonId(port, password) {
  const content = await riotGet(
    port,
    password,
    "/content-service/v3/content"
  );

  const seasons = content.Seasons || [];
  const activeAct = seasons.find(
    (s) => s.IsActive && s.Type === "act"
  );

  if (!activeAct) {
    throw new Error("Could not determine the current competitive season.");
  }

  return activeAct.ID;
}

export async function fetchMmr(port, password, puuid) {
  return riotGet(port, password, `/mmr/v1/players/${puuid}`);
}

export function extractRankData(mmrResponse, seasonId) {
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
