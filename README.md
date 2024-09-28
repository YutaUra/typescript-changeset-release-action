# typescript-changeset-release-action [![ts](https://github.com/yutaura/typescript-changeset-release-action/workflows/ts.yaml/badge.svg)](https://github.com/yutaura/typescript-changeset-release-action/actions/workflows/ts.yaml)

This action is a github action release manager using changeset.

## Specification

To run this action, create a workflow as follows:

```yaml
# .github/workflows/release.yaml
name: release

on:
  push:
    branches:
      - main

jobs:
  tag:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4.1.7

      # build your github action
      # - run: pnpm build

      - uses: YutaUra/typescript-changeset-release-action
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        env:
          # if auto-merge is true, you need to set GITHUB_TOKEN
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Inputs

| Name                   | Default           | Description                                                                          |
| ---------------------- | ----------------- | ------------------------------------------------------------------------------------ |
| `auto-merge`           | `false`           | enable auto merge for version bump PR                                                |
| `commit-message`       | `Version Action`  | The commit message                                                                   |
| `pr-title`             | `Release Action`  | The title of PR                                                                      |
| `setupGitUser`         | `true`            | Set up git user(`github-actions[bot]<github-actions[bot]@users.noreply.github.com>`) |
| `createGithubReleases` | `true`            | Create a release on GitHub                                                           |
| `branch`               | `github.ref_name` | The branch name to create a release                                                  |

### Outputs

## Development

### Keep consistency of generated files

If a pull request needs to be fixed by Prettier, an additional commit to fix it will be added by GitHub Actions.
See https://github.com/int128/update-generated-files-action for details.

### Dependency update

You can enable Renovate to update the dependencies.
This repository is shipped with the config https://github.com/int128/typescript-action-renovate-config.
