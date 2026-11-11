---
name: ship-with-receipt
description: "Open a pull request with Why's receipt at the bottom, so reviewers see what the change rests on. Use whenever you are about to create a pull request (gh pr create) in a repo where Why is on, or when the user asks for a receipt, to record a PR, or runs /why:ship-with-receipt."
---

# Ship with a receipt

The receipt is a label, never a gate. If any Design Bits call fails, open the PR anyway and mention it once.

1. Open the PR as you normally would (`gh pr create …`) and note its number.
2. Gather, from this machine only:
   - paths: `git diff --name-only <base>...HEAD` (names only, never contents)
   - undo cost: `why-undo`, and keep its `reasons`
   - the feature flag the change sits behind, if the code makes it obvious
   - the ticket key, from the branch or the PR title
3. Decide what it rests on. If you ran preflight for this work, suggest the need key it found (at most three, and only those that truly fit). If it is a labelled bet, set `declared: "experiment"`. If it is upkeep (dependencies, refactors, CI, docs), set `declared: "maintenance"`. Otherwise suggest nothing: Why will show it as shipped on vibes, which is allowed.
4. Call `record_change` with `pr`, `title`, `branch`, `paths`, `flag`, `ticket`, `declared`, `suggest` and `undo`.
5. For each suggestion, ask the user the question `record_change` gives you, and call `confirm_link` with their answer. Never confirm on their behalf.
6. Call `receipt` and add it to the end of the PR description: `gh pr view <n> --json body -q .body`, append the receipt (replace an earlier block between `<!-- why:receipt -->` and the end, if there is one), then `gh pr edit <n> --body-file -`.
7. Offer a persona review once ("Want a persona to review this first? /why:persona-review"). Never run it unasked.

The receipt carries need titles, counts and a link, and never a quote or a name. Keep it that way: don't add quotes to the PR yourself.
