# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-04-03

### Added

- Peak rank, RR, and ELO display alongside current stats
- Current act detection via valorant-api.com seasons endpoint
- Shard detection from ShooterGame.log instead of hardcoded region mapping
- Custom application icon for the built `.exe`
- Build script (`scripts/build.cjs`) using programmatic APIs (esbuild, pkg, rcedit)
- File metadata embedded in `.exe` (product name, description, version)

### Changed

- Display layout now has "Current" and "Peak" sections with separator lines
- Widened output box from 28 to 30 characters to fit new content
- Rank data now fetched from current act specifically instead of highest across all acts
- Shard resolved from game logs for accuracy (fixes wrong API region)

### Fixed

- ANSI escape codes breaking box alignment in terminal output
- Display padding now applies color after padding to prevent misalignment

## [1.0.0] - 2026-04-03

### Added

- CLI tool that displays current Valorant rank, RR, and ELO
- Automatic authentication via Riot Client lockfile (no manual login required)
- Styled terminal output with Unicode box drawing and rank-colored text
- Player name and tag display (`Account: Name#Tag`)
- Tier names fetched at runtime from valorant-api.com
- Fallback to presence data when seasonal MMR data is unavailable
- Standalone `.exe` build via esbuild + pkg
- GitHub Actions workflow for automated release builds
- GitHub Actions CI workflow with Biome lint and TypeScript type checking
- Biome configuration for linting and formatting
