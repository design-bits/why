---
name: graveyard
description: "Show the features nothing holds up (no confirmed reason, untouched for 90 days, nobody mentions them) and help remove one safely. Use when the user asks what could be deleted, wants to simplify the product, or runs /why:graveyard."
---

# The feature graveyard

1. Call the `graveyard` tool on the `designbits` MCP server and show its list.
2. If the user picks one to remove:
   - Call `why` with its flag or path, and say what it rests on and who might still use it.
   - Removing a feature is always costly to undo. Before writing the removal, suggest asking the accounts that may rely on it, and offer to draft that message.
   - When they say go ahead: make a branch, remove the feature's code and its flag, and run the tests.
   - Open the PR with why:ship-with-receipt, and add `"removal"` to `undo.reasons`. In the PR description, say why it is safe: no reason recorded, last change date, mentions in the last 90 days.
   - Offer to record the decision with why:decide, with a date to look again.
3. Why never removes anything by itself. Only the person decides.
