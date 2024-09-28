import * as core from "@actions/core";
import { run } from "./run.js";

const main = async (): Promise<void> => {
  await run({
    setupGitUser: core.getBooleanInput("setupGitUser"),
  });
};

main().catch((e: Error) => {
  core.setFailed(e);
  console.error(e);
});
