// Suppress Node 18 experimental warnings (Fetch API) and TLS warning
process.removeAllListeners("warning");
// Bypass TLS verification for Riot's self-signed localhost cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { renderError, renderRankBox } from "./display.js";
import { readLockfile } from "./lockfile.js";
import { fetchTierNames, formatRankInfo } from "./rank.js";
import { fetchRankData, fetchRiotContext } from "./riot-api.js";

function waitForKeypress(): Promise<void> {
	return new Promise(() => {
		console.log("  Press any key to exit...");
		process.stdin.setRawMode(true);
		process.stdin.resume();
		process.stdin.once("data", () => {
			process.stdin.setRawMode(false);
			process.exit(0);
		});
	});
}

async function main(): Promise<void> {
	try {
		// Step 1: Read lockfile
		const lockfile = readLockfile();

		// Step 2: Get auth context and tier names in parallel
		const [ctx, tierNames] = await Promise.all([
			fetchRiotContext(lockfile.port, lockfile.password),
			fetchTierNames(),
		]);

		// Step 3: Fetch rank data from remote Valorant API
		const { tier, rr } = await fetchRankData(ctx);

		// Step 4: Format and display
		const rankInfo = formatRankInfo(tier, rr, tierNames);
		renderRankBox(rankInfo);
	} catch (error) {
		renderError(error instanceof Error ? error.message : String(error));
	}

	await waitForKeypress();
}

main();
