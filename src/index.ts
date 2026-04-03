// Suppress Node 18 experimental warnings (Fetch API) and TLS warning
process.removeAllListeners("warning");
// Bypass TLS verification for Riot's self-signed localhost cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { renderError, renderRankBox } from "./display.js";
import { readLockfile } from "./lockfile.js";
import { fetchGameData, formatRankInfo } from "./rank.js";
import { fetchRankData, fetchRiotContext } from "./riot-api.js";

function waitForKeypress(): Promise<void> {
	return new Promise(() => {
		console.log("  Press any key to exit...");
		if (typeof process.stdin.setRawMode === "function") {
			process.stdin.setRawMode(true);
		}
		process.stdin.resume();
		process.stdin.once("data", () => {
			process.exit(0);
		});
	});
}

async function main(): Promise<void> {
	try {
		const lockfile = readLockfile();

		const [ctx, gameData] = await Promise.all([
			fetchRiotContext(lockfile.port, lockfile.password),
			fetchGameData(),
		]);

		const { tier, rr, peakTier, peakRr } = await fetchRankData(
			ctx,
			gameData.currentActId,
		);

		const playerName = `${ctx.gameName}#${ctx.gameTag}`;
		const rankInfo = formatRankInfo(
			tier,
			rr,
			peakTier,
			peakRr,
			gameData.tierNames,
			playerName,
		);
		renderRankBox(rankInfo);
	} catch (error) {
		renderError(error instanceof Error ? error.message : String(error));
	}

	await waitForKeypress();
}

main();
