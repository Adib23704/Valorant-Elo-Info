# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-03

### Added

- CLI tool that displays current Valorant rank, RR, and ELO
- Automatic authentication via Riot Client lockfile (no manual login required)
- ELO calculation using formula: `(tier * 100) - 300 + RR`
- Styled terminal output with Unicode box drawing and rank-colored text
- Player name and tag display (`Account: Name#Tag`)
- Tier names fetched at runtime from valorant-api.com
- Fallback to presence data when seasonal MMR data is unavailable
- Region-to-shard mapping (NA, EU, AP, KR, LATAM, BR, SA3)
- Standalone `.exe` build via esbuild + pkg
- GitHub Actions workflow for automated release builds
- GitHub Actions CI workflow with Biome lint and TypeScript type checking
- Biome configuration for linting and formatting
