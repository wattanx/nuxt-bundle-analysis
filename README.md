# Nuxt.js Bundle Analysis Scripts

Analyzes each PR's impact on your nuxt.js app's bundle size and displays it using a comment.
By combining this script with a github actions, it is possible to send bundle size measurement results to Pull Request.
(Nuxt3 is not supported)

![image](https://user-images.githubusercontent.com/43837308/159209639-518f7136-e471-41d0-8305-a67265432082.png)

## Installation

1. Run the following command. The command will create a `.github/workflows` directory in your project root and add a `nuxt_bundle_analysis.yml` file to it - that's all it takes!

```bash
npx -p nuxt-bundle-analysis generate
```

2. Setting nuxt.config.js and Build.
   Set nuxt.config.js as follows so that bundle statistics are output.
   After configuration and build, `.nuxt/stats.client.json` will be output.

```js:nuxt.config.js
export default {
  build: {
    analyze: {
      generateStatsFile: true,
      analyzeMode: "disabled",
      openAnalyzer: false,
    },
  },
};
```

## Configuration

This script uses the settings described in package.json. `nuxtBundleAnalysis`
See [here](#Options) for options.

```json:package.json
"devDependencies": {},
"nuxtBundleAnalysis": {
"statsFile": ".nuxt/stats/client.json"
}
```

## Description of each script

- `report.ts`
  `report.ts` calculates bundle size based on ` statsFile` and outputs data for comparison.(`analyze/__bundle_analysis.json` is generated.)

- `compare.ts`
  `compare.ts` compares `analyze/base/bundle/__bundle_analysis.json` and `analyze/__bundle_analysis.json` and generates a text file containing the difference in bundle size The following is an example of the process.(`analyze/__bundle_analysis_comment.txt` is generated.)

## Options

| property               | type   | description                                             | default                 |
| :--------------------- | :----- | :------------------------------------------------------ | :---------------------- |
| `statsFile`            | string | The path to the json file containing bundle statistics. | .nuxt/stats/client.json |
| `buildOutputDirectory` | string | Directory generated by `nuxt build`                     | .nuxt                   |

## GitHub Actions Sample

[actions-template](https://github.com/wattanx/nuxt-bundle-analysis/tree/main/actions-template/nuxt-bundle-analysis.yml)
