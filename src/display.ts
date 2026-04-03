import chalk from "chalk";
import type { RankInfo } from "./rank.js";

function getRankColor(tier: number): (str: string) => string {
	if (tier === 0) return chalk.gray; // Unranked
	if (tier <= 5) return chalk.hex("#6e6e6e"); // Iron
	if (tier <= 8) return chalk.hex("#cd7f32"); // Bronze
	if (tier <= 11) return chalk.hex("#c0c0c0"); // Silver
	if (tier <= 14) return chalk.hex("#ffd700"); // Gold
	if (tier <= 17) return chalk.hex("#00c8c8"); // Platinum
	if (tier <= 20) return chalk.hex("#b388ff"); // Diamond
	if (tier <= 23) return chalk.hex("#00e676"); // Ascendant
	if (tier <= 26) return chalk.hex("#ff4655"); // Immortal
	return chalk.hex("#ffedaa"); // Radiant
}

function padRight(str: string, len: number): string {
	return str + " ".repeat(Math.max(0, len - str.length));
}

function line(
	text: string,
	colorFn: (s: string) => string,
	innerWidth: number,
): string {
	const padded = padRight(text, innerWidth - 3);
	return `  ${chalk.bold("║")}   ${colorFn(padded)}${chalk.bold("║")}`;
}

export function renderRankBox(rankInfo: RankInfo): void {
	const {
		playerName,
		rankName,
		rr,
		elo,
		tier,
		peakRankName,
		peakRr,
		peakElo,
		peakTier,
	} = rankInfo;

	const colorFn = getRankColor(tier);
	const peakColorFn = getRankColor(peakTier);

	const title = "VALORANT ELO INFO";
	const innerWidth = 30;

	const top = `  ${chalk.bold(`╔${"═".repeat(innerWidth)}╗`)}`;
	const titleBar = `  ${chalk.bold("║")}${padRight("", Math.floor((innerWidth - title.length) / 2))}${chalk.bold.white(title)}${padRight("", Math.ceil((innerWidth - title.length) / 2))}${chalk.bold("║")}`;
	const sep = `  ${chalk.bold(`╠${"═".repeat(innerWidth)}╣`)}`;
	const empty = `  ${chalk.bold("║")}${" ".repeat(innerWidth)}${chalk.bold("║")}`;
	const bottom = `  ${chalk.bold(`╚${"═".repeat(innerWidth)}╝`)}`;

	console.log();
	console.log(top);
	console.log(titleBar);
	console.log(sep);
	console.log(empty);
	console.log(line(`Player: ${playerName}`, chalk.cyan, innerWidth));
	console.log(empty);
	console.log(line("── Current ──", chalk.dim, innerWidth));
	console.log(line(`Rank:   ${rankName}`, colorFn, innerWidth));
	console.log(line(`RR:     ${rr} / 100`, chalk.white, innerWidth));
	console.log(line(`ELO:    ${elo.toLocaleString()}`, chalk.white, innerWidth));
	console.log(empty);
	console.log(line("── Peak ──", chalk.dim, innerWidth));
	console.log(line(`Rank:   ${peakRankName}`, peakColorFn, innerWidth));
	console.log(line(`RR:     ${peakRr} / 100`, chalk.white, innerWidth));
	console.log(
		line(`ELO:    ${peakElo.toLocaleString()}`, chalk.white, innerWidth),
	);
	console.log(empty);
	console.log(bottom);
	console.log();
}

export function renderError(message: string): void {
	console.log();
	console.log(`  ${chalk.red("Error:")} ${message}`);
	console.log();
}
