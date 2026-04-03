<p align="center">
  <img src="icon.ico" width="80" alt="Valorant Elo Info" />
</p>

<h1 align="center">Valorant Elo Info</h1>

<p align="center">
  Instantly check your Valorant rank, RR, and ELO from the command line.<br/>
  No login required &mdash; reads directly from the Riot Client.
</p>

<p align="center">
  <a href="https://github.com/Adib23704/Valorant-Elo-Info/releases/latest"><img src="https://img.shields.io/github/v/release/Adib23704/Valorant-Elo-Info?style=flat-square&color=blue" alt="Latest Release" /></a>
  <a href="https://github.com/Adib23704/Valorant-Elo-Info/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Adib23704/Valorant-Elo-Info/ci.yml?style=flat-square&label=CI" alt="CI Status" /></a>
  <a href="https://github.com/Adib23704/Valorant-Elo-Info/actions/workflows/release.yml"><img src="https://img.shields.io/github/actions/workflow/status/Adib23704/Valorant-Elo-Info/release.yml?style=flat-square&label=Build" alt="Build Status" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/Adib23704/Valorant-Elo-Info?style=flat-square" alt="License" /></a>
  <a href="https://github.com/Adib23704/Valorant-Elo-Info/releases/latest"><img src="https://img.shields.io/github/downloads/Adib23704/Valorant-Elo-Info/total?style=flat-square&color=green" alt="Downloads" /></a>
</p>

---

## Preview

```
  ╔══════════════════════════════╗
  ║      VALORANT ELO INFO       ║
  ╠══════════════════════════════╣
  ║                              ║
  ║   Player: Azure#emm          ║
  ║                              ║
  ║   ── Current ──              ║
  ║   Rank:   PLATINUM 1         ║
  ║   RR:     30 / 100           ║
  ║   ELO:    1,230              ║
  ║                              ║
  ║   ── Peak ──                 ║
  ║   Rank:   DIAMOND 2          ║
  ║   RR:     67 / 100           ║
  ║   ELO:    1,667              ║
  ║                              ║
  ╚══════════════════════════════╝
```

> Rank names are color-coded by tier in the actual terminal output.

## Features

- **Zero login required** - Authenticates automatically through the Riot Client
- **Current rank** - Shows your rank, RR (0-100), and calculated ELO for the current act
- **Peak rank** - Displays your highest rank, RR, and ELO across all acts
- **Player identity** - Shows your Riot ID (Name#Tag)
- **Color-coded ranks** - Each rank tier has a distinct color (Iron, Bronze, Silver, Gold, Platinum, Diamond, Ascendant, Immortal, Radiant)
- **Always up to date** - Tier names fetched at runtime from [valorant-api.com](https://valorant-api.com)
- **Accurate region detection** - Shard detected from game logs, not hardcoded

## Download

### Option 1: Pre-built executable (recommended)

1. Download `Valorant-Elo-Info.exe` from the [latest release](https://github.com/Adib23704/Valorant-Elo-Info/releases/latest)
2. Open Valorant (must be at the main menu or in-game)
3. Run the `.exe`

No Node.js or any other runtime needed.

### Option 2: Run from source

Requires [Node.js 22+](https://nodejs.org) and [pnpm](https://pnpm.io).

```bash
git clone https://github.com/Adib23704/Valorant-Elo-Info.git
cd Valorant-Elo-Info
pnpm install
pnpm start
```

## How It Works

```
Riot Client Lockfile ──> Local API ──> Auth Tokens ──> Valorant Remote API
         │                   │                              │
    Port + Password     PUUID, Presence              MMR / Rank Data
                        Client Version
                        Shard (from logs)
```

1. **Reads the Riot Client lockfile** at `%LOCALAPPDATA%/Riot Games/Riot Client/Config/lockfile` to get the local API port and password
2. **Connects to the local Riot Client API** on `127.0.0.1` to fetch your PUUID, auth tokens, and presence data
3. **Detects your shard** from `ShooterGame.log` for accurate API routing
4. **Calls the Valorant remote API** (`pd.{shard}.a.pvp.net`) to get your MMR data for the current act
5. **Fetches tier names** from [valorant-api.com](https://valorant-api.com) so rank names stay current
6. **Calculates ELO** using `(tier x 100) - 300 + RR` and displays everything in a styled terminal box

## Building

To build a standalone `.exe` from source:

```bash
pnpm build
```

This runs:

1. **esbuild** - Compiles TypeScript and bundles into a single file
2. **pkg** - Packages into a standalone Windows executable
3. **rcedit** - Embeds the application icon and metadata

Output: `dist/Valorant-Elo-Info.exe`

## Privacy & Security

- **No credentials stored** - Authentication happens through the Riot Client's local API
- **No data sent anywhere** - All Riot API calls go to `127.0.0.1` (local) or official Riot servers
- **No game files modified** - Read-only access to lockfile and logs
- **Fully open source** - Inspect every line of code

## Contributing

Contributions are welcome! Feel free to open an [issue](https://github.com/Adib23704/Valorant-Elo-Info/issues) or submit a pull request.

```bash
pnpm install        # Install dependencies
pnpm start          # Run the app
pnpm lint           # Check for lint errors
pnpm format         # Format code
pnpm typecheck      # Type check
pnpm validate       # Lint + type check
pnpm build          # Build standalone .exe
```

## Disclaimer

This project is not affiliated with, endorsed by, or connected to Riot Games or any of its subsidiaries. Valorant and Riot Games are trademarks of Riot Games, Inc.

## License

[MIT](LICENSE)
