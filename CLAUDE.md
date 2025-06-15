# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a bundle analysis tool for Nuxt applications that analyzes JavaScript bundle sizes and provides automated PR comments showing size changes.

## Commands

### Development Commands

- `pnpm build` - Build the project
- `pnpm test` - Run full test suite (builds everything, runs report & compare, then tests)
- `pnpm test:update` - Update test snapshots
- `pnpm test:vite` - Run tests with vite builder
- `pnpm build:playground` - Build the playground Nuxt app
- `pnpm report` - Generate bundle analysis JSON
- `pnpm compare` - Compare current bundle with base bundle

### Release Commands

- `pnpm minor` - Bump minor version

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
   - Aggregates JavaScript files

5. **`src/utils.ts`** - Configuration management
   - Reads from `package.json` → `nuxtBundleAnalysis` key
   - Environment variable override: `NUXT_BUNDLE_ANALYSIS_BUILDER`

### File Paths

- Bundle analysis output: `.nuxt/analyze/__bundle_analysis.json`
- Base branch bundle: `.nuxt/analyze/base/bundle/__bundle_analysis.json`
- PR comment: `.nuxt/analyze/__bundle_analysis_comment.txt`

### Testing

Uses vitest with snapshot testing. The test flow:

1. Builds the project
2. Runs report and compare commands
3. Validates outputs against snapshots

### Builder Support

- **Webpack**: Uses `stats.json` with named chunk groups
- **Vite**: Directly analyzes build output directory

## Key Patterns

- Configuration lives in `package.json` under `nuxtBundleAnalysis` key
- Uses defu for merging options with defaults
- GitHub Actions workflow identifies comments with `<!-- __NUXTJS_BUNDLE -->`
- Graceful handling when no size changes detected
