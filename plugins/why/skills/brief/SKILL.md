---
name: brief
description: "Brief yourself on which customers need a piece of work before building it, from the team's approved needs in Design Bits. Use once when starting on a ticket or branch, when Why's session note says so, or when the user asks who needs this."
---

# Brief

Before writing code for a ticket, learn which approved needs it serves, so you build the right thing first time. Do this once per task.

1. Work out the repo: run `git remote get-url origin` and reduce it to `owner/name` (drop the host, a trailing `.git` and any credentials).
2. Call the `brief` tool on the `designbits` MCP server with:
   - `repo`: that `owner/name`
   - `ticket`: the ticket key and title if you know them (`LIN-482 Show who changed a permission`)
   - `branch`: the current branch
   - `text`: the user's request in a sentence or two
3. Show the returned text verbatim, in 10 lines or fewer. Then build from it.
4. If the returned text is empty, say nothing about Design Bits and carry on.

Rules:

- Never copy a quote into code, comments, test names, commit messages or PR text. Quotes belong in Design Bits; use a need's title or key instead.
- Never ask the user anything because of the brief, and never block on it.
- Send only what is listed above: never paths or the diff.
- If the tool is missing or fails, carry on without saying anything.
