---
name: why
description: "Explain why something in the product exists, from Design Bits: a file path, a pull request, a feature flag, a ticket key or a need key like N-14. Use when the user asks why we built something, who asked for it, whether it is safe to change or delete, or runs /why:why."
argument-hint: "<path | #PR | flag | TICKET-1 | N-14>"
---

# Why does this exist?

Call the `why` tool on the `designbits` MCP server with `ref` set to what the user asked about: a path (`src/history/Panel.vue` or a folder), a PR (`#1182`), a feature flag (`perm_history`), a ticket key (`LIN-482`) or a need key (`N-14`). Pass `project` if the plugin's settings name one.

Show the answer as it comes, in a few lines. If Why has nothing recorded, say so in one sentence and suggest `/why:backfill` to record recent merges.

If the user is asking because they want to change or delete it: say what it rests on and whether anyone still mentions it. Deleting a feature is costly to undo, so suggest checking with the people who may still use it.
