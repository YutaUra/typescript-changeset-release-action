import "source-map-support/register.js";

import * as core from "@actions/core";

const main = async () => {};

main().catch((e: Error) => {
  core.setFailed(e);
  console.error(e);
});
