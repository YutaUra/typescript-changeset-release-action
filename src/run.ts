import { readFile } from "node:fs/promises";
import * as core from "@actions/core";
import { exec, getExecOutput } from "@actions/exec";

type Inputs = {
  setupGitUser: boolean;
};

export const run = async (inputs: Inputs) => {
  // fix .gitignore
  await exec("sed", ["-i", "-E", "s|^/?dist/?||g", ".gitignore"]);
  // remove unnecessary files
  await exec("rm", ["-rf", ".github/workflows"]);

  const { version } = JSON.parse(await readFile("./package.json", "utf8"));

  // check v{version} tag exists
  // fetch specific tag
  await exec("git", ["fetch", "--tags"]);
  const { stdout: tagExists } = await getExecOutput("git", [
    "tag",
    "-l",
    `v${version}`,
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
      "github-actions[bot]@users.noreply.github.com",
    ]);
  }

  // commit changes
  await exec("git", ["add", "."]);
  await exec("git", ["commit", "-m", `Release v${version}`]);
  await exec("git", ["tag", `v${version}`]);
  // this log is for changeset to notice the new tag
  // see: https://github.com/changesets/action/blob/50750fa876cc1e54c7cb972db5e2f7271fc53d99/src/run.ts#L176
  console.log(`New tag: v${version}`);
};
