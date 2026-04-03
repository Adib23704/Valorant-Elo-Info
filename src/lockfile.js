import { readFileSync } from "fs";
import { join } from "path";

export function readLockfile() {
  const localAppData = process.env.LOCALAPPDATA;
  if (!localAppData) {
    throw new Error("LOCALAPPDATA environment variable not found.");
  }

  const lockfilePath = join(
    localAppData,
    "Riot Games",
    "Riot Client",
    "Config",
    "lockfile"
  );

  let content;
  try {
    content = readFileSync(lockfilePath, "utf-8");
  } catch {
    throw new Error(
      "Riot Client is not running. Please open Valorant and try again."
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
