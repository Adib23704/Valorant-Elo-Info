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

function pad(str: string, len: number): string {
	return str + " ".repeat(Math.max(0, len - str.length));
}

export function renderRankBox(rankInfo: RankInfo): void {
	const { playerName, rankName, rr, elo, tier } = rankInfo;
	const colorFn = getRankColor(tier);

	const title = "VALORANT ELO INFO";
	const nameLine = `Account: ${playerName}`;
	const rankLine = `Rank:    ${rankName}`;
	const rrLine = `RR:      ${rr} / 100`;
	const eloLine = `Elo:     ${elo.toLocaleString()}`;

	const innerWidth = 28;
	const top = `  ${chalk.bold(`╔${"═".repeat(innerWidth)}╗`)}`;
	const titleBar = `  ${chalk.bold("║")}${pad("", Math.floor((innerWidth - title.length) / 2))}${chalk.bold.white(title)}${pad("", Math.ceil((innerWidth - title.length) / 2))}${chalk.bold("║")}`;
	const sep = `  ${chalk.bold(`╠${"═".repeat(innerWidth)}╣`)}`;
	const empty = `  ${chalk.bold("║")}${" ".repeat(innerWidth)}${chalk.bold("║")}`;
	const nLine = `  ${chalk.bold("║")}   ${chalk.cyan(pad(nameLine, innerWidth - 3))}${chalk.bold("║")}`;
	const rLine = `  ${chalk.bold("║")}   ${colorFn(pad(rankLine, innerWidth - 3))}${chalk.bold("║")}`;
	const rrL = `  ${chalk.bold("║")}   ${chalk.white(pad(rrLine, innerWidth - 3))}${chalk.bold("║")}`;
	const eloL = `  ${chalk.bold("║")}   ${chalk.white(pad(eloLine, innerWidth - 3))}${chalk.bold("║")}`;
	const bottom = `  ${chalk.bold(`╚${"═".repeat(innerWidth)}╝`)}`;

	console.log();
	console.log(top);
	console.log(titleBar);
	console.log(sep);
	console.log(empty);
	console.log(nLine);
	console.log(rLine);
	console.log(rrL);
	console.log(eloL);
	console.log(empty);
	console.log(bottom);
	console.log();
}

export function renderError(message: string): void {
	console.log();
	console.log(`  ${chalk.red("Error:")} ${message}`);
	console.log();
}
