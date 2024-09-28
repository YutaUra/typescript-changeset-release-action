import "source-map-support/register.js";

import * as core from "@actions/core";
import { z } from "zod";

type Config = {
  autoMerge: boolean;
  commitMessage: string;
  prTitle: string;
  setupGitUser: boolean;
  createGithubReleases: boolean;
};

const defaultConfig = {
  autoMerge: false,
  commitMessage: "Version Action",
  prTitle: "Release Action",
  setupGitUser: true,
  createGithubReleases: true,
} satisfies Config;

const booleanInputSchema = z.union([
  z.literal("").transform(() => undefined),
  z.enum(["true", "TRUE", "True"]).transform(() => true),
  z.enum(["false", "FALSE", "False"]).transform(() => false),
]);
const stringInputSchema = z.union([
  z.literal("").transform(() => undefined),
  z.string(),
]);

const loadUserConfig = (): Partial<Config> => {
  const autoMerge = booleanInputSchema.parse(core.getInput("auto-merge"));
  const commitMessage =
    stringInputSchema.parse(core.getInput("commit-message")) ||
    stringInputSchema.parse(core.getInput("commit"));
  const prTitle =
    stringInputSchema.parse(core.getInput("pr-title")) ||
    stringInputSchema.parse(core.getInput("title"));
  const setupGitUser =
    booleanInputSchema.parse(core.getInput("setup-git-user")) ??
    booleanInputSchema.parse(core.getInput("setupGitUser"));
  const createGithubReleases =
    booleanInputSchema.parse(core.getInput("create-github-releases")) ??
    booleanInputSchema.parse(core.getInput("createGithubReleases"));

  return {
    autoMerge,
    commitMessage,
    prTitle,
    setupGitUser,
    createGithubReleases,
  };
};

const main = async () => {
  const userConfig = loadUserConfig();

  // Merge the two configs, user config taking precedence
  const config = {
    ...defaultConfig,
    ...userConfig,
  };

  for (const [key, value] of Object.entries(config)) {
    core.setOutput(key, value);
    core.info(`${key}: ${value}`);
  }
};

main().catch((e: Error) => {
  core.setFailed(e);
  console.error(e);
});
