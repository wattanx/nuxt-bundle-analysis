import { execSync } from "child_process";
import fs from "fs";

beforeAll(() => {
  process.chdir("__tests__/sample");
  execSync("yarn build");

  fs.mkdirSync(".nuxt/analyze/base/bundle", {
    recursive: true,
  });

  fs.copyFileSync(
    "../template/__bundle_analysis.json",
    ".nuxt/analyze/base/bundle/__bundle_analysis.json"
  );
});

afterAll(() => {
  process.chdir("../../");
});
