// src/main.ts
import "source-map-support/register.js";
import * as core2 from "@actions/core";

// src/run.ts
import { readFile } from "node:fs/promises";
import * as core from "@actions/core";
import { exec, getExecOutput } from "@actions/exec";
var run = async (inputs) => {
  await exec("sed", ["-i", "-E", "s|^/?dist/?||g", ".gitignore"]);
  await exec("rm", ["-rf", ".github/workflows"]);
  const { version } = JSON.parse(await readFile("./package.json", "utf8"));
  await exec("git", ["fetch", "--tags"]);
  const { stdout: tagExists } = await getExecOutput("git", [
    "tag",
    "-l",
    `v${version}`
  ]);
  if (tagExists.trim()) {
    core.info(`v${version} tag already exists`);
    core.info("Skipping release");
    return;
  }
  if (inputs.setupGitUser) {
    core.info("setting git user");
    await exec("git", ["config", "user.name", "github-actions[bot]"]);
    await exec("git", [
      "config",
      "user.email",
      "github-actions[bot]@users.noreply.github.com"
    ]);
  }
  await exec("git", ["add", "."]);
  await exec("git", ["commit", "-m", `Release v${version}`]);
  await exec("git", ["tag", `v${version}`]);
  console.log(`New tag: v${version}`);
};

// src/main.ts
var main = async () => {
  await run({
    setupGitUser: core2.getBooleanInput("setupGitUser")
  });
};
main().catch((e) => {
  core2.setFailed(e);
  console.error(e);
});
//# sourceMappingURL=main.js.map