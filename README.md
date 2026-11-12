# Why for Claude Code

Build what customers asked for. [Design Bits](https://designbits.app) drafts needs from the customer words your team already has, and its GitHub Action puts a note on each pull request in a linked repo saying which customers asked for it. This plugin adds the optional part for the coding agent: a short brief of the matching needs before it builds.

It never blocks a merge and never nags. The PR note comes from the Action, not from this plugin.

## Install

You need a Design Bits workspace. In Claude Code (the terminal, VS Code or the desktop app), run:

```
/plugin marketplace add design-bits/why
/plugin install why@designbits
```

Then run `/mcp`, choose **designbits** and sign in. In Design Bits, the workspace's **Integrations** page walks through the same steps and adds the GitHub Action.

## What you get

**One skill, `brief`.** Once per task, before building, the agent asks Design Bits which approved needs match the ticket and branch, and shows the answer in 10 lines or fewer. It says nothing when nothing matches. It is told never to copy a quote into code, comments, test names, commit messages or PR text, and never to ask you anything. It sends the repo name, ticket, branch and a sentence of your request: never paths or the diff.

**Three commands** on your PATH:

- `why-quiet`: silences the note at session start (`why-quiet off` turns it back on).
- `why-link`: turns the note on for a repo that doesn't have the Action's workflow file (`why-link off` turns it off).
- `why-paths`: the path check described below.

**Two hooks:**

- **A note at session start:** one line asking the agent to use the brief skill. It speaks only in repos linked to Design Bits (the Action's workflow file is checked in, or you ran `why-link`), stays silent after a compaction, and for good once you run `why-quiet`.
- **A path hook, not yet confirmed:** before `record_change`, a hook tries to drop secrets, `.env` files, keys and any path the lists `why-paths` last used in this repo leave out. It isn't yet confirmed to run in every Claude Code version, so the checks below don't count on it.

## What leaves your machine

- **Never your code.** The brief sends the repo name, ticket, branch and a short description of the task, never paths or the diff.
- **For a pull request,** the Action sends its number, title, branch, dates, the author's GitHub username and the file paths your workflow file allows (names only, never contents), filtered in your CI. Design Bits checks them again when they arrive, so anything your lists leave out is dropped. Secrets, `.env` files and keys are never kept. The plugin itself sends no paths.
- **Nothing from the session note.** It reads local git and sends nothing.
- **No quotes on pull requests.** PR notes carry need titles, keys, counts and a link, never a quote or the name of anyone you spoke to.

## Settings

Both are optional. Set them with `/plugin configure why@designbits`:

- `project`: the Design Bits workspace this repo builds. Leave it empty: the brief finds the workspace that links this repo.
- `base_url`: where Design Bits runs. The default is `https://designbits.app`.

## About this repo

Each release is published here from Design Bits' main repository, so pull requests here aren't merged. Problems and ideas are welcome as issues.

MIT licensed.
