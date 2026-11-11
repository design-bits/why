# Why for Claude Code

A reason for every change. Why reads your team's research in [Design Bits](https://designbits.app) and brings it to where the code gets written: who needs the work before you build it, a receipt on the pull request, and how it landed after you ship.

It never blocks a merge and never nags. Work with no reason recorded is labelled *shipped on vibes*, and that's allowed.

## Install

You need a Design Bits project. In Claude Code (the terminal, VS Code or the desktop app), run:

```
/plugin marketplace add design-bits/why
/plugin install why@designbits
```

Then run `/mcp`, choose **designbits** and sign in. Tick the project this repo builds and allow *Record what it builds*. In Design Bits, the project's **Integrations → Why for Claude Code** page walks through the same steps, including the paths Why may never keep, before anything is sent.

## What you get

| Command | When |
|---|---|
| `/why:preflight` | Before you build: who needs this, in their words, and what already exists |
| `/why:ship-with-receipt` | When you open a pull request: a receipt at the end of its description |
| `/why:why <path, #PR, flag, ticket or need>` | Why something exists, and whether it's safe to change |
| `/why:backfill [days]` | Records recent merged pull requests, so the board has history from day one |
| `/why:board` | The product as built, with the reason for each part |
| `/why:landing` | How recent merges landed, and any tripwire that went off |
| `/why:decide` | Writes down a decision, what it rests on and what would change your mind |
| `/why:graveyard` | Features nothing holds up, and a safe way to remove one |
| `/why:persona-review [persona or --panel] [target]` | A persona from your research reviews a diff, pull request, screenshots or prototype |
| `/why:quiet [off]` | Silences the note at session start |

Also:

- **A note at session start:** one line naming your branch and ticket, so Claude Code briefs itself before building. It stays silent after a compaction, and for good once you run `/why:quiet`.
- **`why-undo`:** how costly the work on this branch would be to undo, read from the diff on your machine.
- **The board beside the chat:** `/why-board` opens it in a pane (Claude Code 2.1.287 or later).

## What leaves your machine

- **Never your code.** The undo cost is worked out locally. Only `low` or `high` and the names of the reasons (like `billing`) are sent.
- **For a pull request,** Why sends its number, title, branch, dates, feature flag and file paths (names only, never contents). Design Bits keeps only the paths your project allows, and never secrets or `.env` files.
- **Nothing from the session note.** It reads local git and sends nothing.
- **No quotes on pull requests.** Receipts carry need titles, keys, counts and a link, never a quote or the name of anyone you spoke to.
- **A suggested link stays a suggestion** until a person confirms it.
- **Persona reviews are labelled *Simulated by AI*.** They are never evidence, and never stand in for real customers when a change would be costly to undo.

## Settings

Both are optional. Set them with `/plugin configure why@designbits`:

- `project`: the Design Bits project this repo builds. Leave it empty if your sign-in reaches only one project.
- `base_url`: where Design Bits runs. The default is `https://designbits.app`.

## About this repo

Each release is published here from Design Bits' main repository, so pull requests here aren't merged. Problems and ideas are welcome as issues.

MIT licensed.
