# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a bundle analysis tool for Nuxt applications that analyzes JavaScript bundle sizes and provides automated PR comments showing size changes.

## Commands

### Development Commands

- `pnpm build` - Build the project using unbuild
- `pnpm test` - Run full test suite (builds everything, runs report & compare, then tests)
- `pnpm test:update` - Update test snapshots
- `pnpm test:vite` - Run tests with vite builder
- `pnpm build:playground` - Build the playground Nuxt app
- `pnpm report` - Generate bundle analysis JSON (run from playground directory)
- `pnpm compare` - Compare current bundle with base bundle (run from playground directory)

### Release Commands

- `pnpm minor` - Bump minor version

### Single Test Execution

- `pnpm test -- -t "test name"` - Run a specific test by name

## Architecture

### Core Modules

1. **`src/generate.ts`** - Interactive CLI for initial setup

   - Creates GitHub Actions workflow
   - Configures package.json options

2. **`src/report.ts`** - Bundle analysis

   - Supports webpack (via stats.json) and vite builders
   - Calculates gzipped sizes
   - Outputs `__bundle_analysis.json`

3. **`src/compare.ts`** - Bundle comparison

   - Generates markdown tables with size changes
   - Creates PR comment content
   - Filters changes below minimum threshold

4. **`src/vite/report.ts`** - Vite-specific analysis

   - Analyzes `.output/public` directory
   - Default: Aggregates all JavaScript files as single "app" bundle
   - With `vitePageAnalysis: true`: Analyzes each page separately using `client.manifest.json`

5. **`src/utils.ts`** - Configuration management
   - Reads from `package.json` → `nuxtBundleAnalysis` key
   - Environment variable overrides:
     - `NUXT_BUNDLE_ANALYSIS_BUILDER` - Set builder type
     - `NUXT_BUNDLE_ANALYSIS_VITE_PAGE_ANALYSIS` - Enable page-level analysis

### File Paths

- Bundle analysis output: `.nuxt/analyze/__bundle_analysis.json`
- Base branch bundle: `.nuxt/analyze/base/bundle/__bundle_analysis.json`
- PR comment: `.nuxt/analyze/__bundle_analysis_comment.txt`

### Configuration

Configuration in `package.json` under `nuxtBundleAnalysis`:
```json
{
  "buildOutputDirectory": ".nuxt",
  "outputDirectory": ".output",
  "statsFile": ".nuxt/stats/client.json",
  "minimumChangeThreshold": 0,
  "builder": "webpack" | "vite",
  "vitePageAnalysis": false
}
```

### Testing

Uses vitest with snapshot testing. The test flow:

1. Builds the project and playground app
2. Runs `test-prepare.mjs` to set up base bundle
3. Executes report and compare commands
4. Validates outputs against snapshots

### Builder Support

- **Webpack**: Uses `stats.json` with named chunk groups for page-level analysis
- **Vite**: 
  - Default mode: Analyzes all JS files in `.output/public` as single bundle
  - Page analysis mode: Uses `client.manifest.json` to analyze each page separately

## Key Patterns

- Configuration lives in `package.json` under `nuxtBundleAnalysis` key
- Uses defu for merging options with defaults
- GitHub Actions workflow identifies comments with `<!-- __NUXTJS_BUNDLE -->`
- Graceful handling when no size changes detected
- All sizes calculated as gzipped sizes
- Monorepo setup using pnpm workspaces with playground as separate package
