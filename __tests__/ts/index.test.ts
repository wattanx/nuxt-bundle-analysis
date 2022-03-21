import { execSync } from "child_process";
import fs from "fs";

describe("ts test", () => {
  it("generated __bundle_analysis.json", async () => {
    execSync("yarn report:ts");
    expect(
      fs.existsSync("../sample/.nuxt/analyze/__bundle_analysis.json")
    ).toBeTruthy();
  });

  it("generated __bundle_analysis_comment.txt", () => {
    execSync("yarn compare:ts");
    expect(
      fs.existsSync("../sample/.nuxt/analyze/__bundle_analysis_comment.txt")
    ).toBeTruthy();
  });

  it("comparison results test", () => {
    const contents = fs
      .readFileSync("../sample/.nuxt/analyze/__bundle_analysis_comment.txt")
      .toString();

    const splitContents = contents.split("\n");

    // decreased
    expect(splitContents.find((x) => x.includes("commons/app"))).toContain(
      "🟢"
    );

    // increased
    expect(
      splitContents.find((x) => x.includes("components/tutorial"))
    ).toContain("🔴");

    // removed
    expect(splitContents.find((x) => x.includes("pages/test"))).toContain(
      "removed"
    );

    // added
    expect(
      splitContents.find((x) => x.includes("components/nuxt-logo"))
    ).toContain("added");

    expect(contents).toMatchSnapshot();
  });

  it("Snapshot of comparison results", () => {
    const contents = fs
      .readFileSync("../sample/.nuxt/analyze/__bundle_analysis_comment.txt")
      .toString();

    expect(contents).toMatchSnapshot();
  });
});
