import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface Lockfile {
	name: string;
	pid: number;
	port: number;
	password: string;
	protocol: string;
}

export function readLockfile(): Lockfile {
	const localAppData = process.env.LOCALAPPDATA;
	if (!localAppData) {
		throw new Error("LOCALAPPDATA environment variable not found.");
	}

	const lockfilePath = join(
		localAppData,
		"Riot Games",
		"Riot Client",
		"Config",
		"lockfile",
	);

	let content: string;
	try {
		content = readFileSync(lockfilePath, "utf-8");
	} catch {
		throw new Error(
			"Riot Client is not running. Please open Valorant and try again.",
		);
	}

	const parts = content.trim().split(":");
	if (parts.length !== 5) {
		throw new Error("Invalid lockfile format.");
	}

	const [name, pid, port, password, protocol] = parts;

	return {
		name,
		pid: parseInt(pid, 10),
		port: parseInt(port, 10),
		password,
		protocol,
	};
}
