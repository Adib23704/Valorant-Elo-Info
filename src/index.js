// Bypass TLS verification for Riot's self-signed localhost cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { readLockfile } from "./lockfile.js";
import { fetchPuuid, fetchCurrentSeasonId, fetchMmr, extractRankData } from "./riot-api.js";
import { fetchTierNames, formatRankInfo } from "./rank.js";
import { renderRankBox, renderError } from "./display.js";

function waitForKeypress() {
  return new Promise((resolve) => {
    console.log("  Press any key to exit...");
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      resolve();
    });
  });
}

async function main() {
  try {
    const lockfile = readLockfile();

    const [puuid, seasonId, tierNames] = await Promise.all([
      fetchPuuid(lockfile.port, lockfile.password),
      fetchCurrentSeasonId(lockfile.port, lockfile.password),
      fetchTierNames(),
    ]);

    const mmrResponse = await fetchMmr(lockfile.port, lockfile.password, puuid);

    const { tier, rr } = extractRankData(mmrResponse, seasonId);

    const rankInfo = formatRankInfo(tier, rr, tierNames);
    renderRankBox(rankInfo);
  } catch (error) {
    renderError(error.message);
  }

  await waitForKeypress();
}

main();
