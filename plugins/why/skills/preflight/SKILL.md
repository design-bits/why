---
name: preflight
description: "Brief yourself on who needs a piece of work before building it, from the team's Design Bits research. Use once when starting on a ticket or branch, when Why's session note says so, or when the user asks who needs this, why we are building it, or runs /why:preflight."
---

# Preflight

Before writing code for a ticket, learn who needs it and what they said, so you build the right thing first time.

1. If the branch already has changes, run `why-undo` (from this plugin, on your PATH). It reads the diff on this machine and prints `{ "cost", "reasons" }`. Send only `reasons` to Design Bits, never paths or the diff.
2. Call the `preflight` tool on the `designbits` MCP server with:
   - `ticket`: the ticket key and title if you know them (`LIN-482 Show who changed a permission`)
   - `branch`: the branch name
   - `text`: one sentence on what you are about to build
   - `undo`: `{ "reasons": [...] }` from step 1, if you ran it
   - `project`: the Design Bits project from the plugin's settings, if one is set
3. Show the user the lines above `---`, exactly, in 15 lines or fewer. Keep everything below `---` to yourself: it is for matching, not for showing.
4. If preflight says nothing matches, say nothing about Why and build as asked.
5. If the undo cost is high, say so plainly in one sentence and offer to draft five questions for the customers it affects before shipping. Never refuse to build.

While you build:
- Use the customers' own words as acceptance checks ("an admin can see who changed access from a phone").
- If your change starts solving a different problem than the one the need describes, say so once.

Rules: quote people word for word with the link preflight gave, and never invent a quote. Feedback is what people told support, "heard", never first-hand evidence: don't present it as what users want. Never name the need unless preflight returned it.
