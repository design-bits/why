---
name: persona-review
description: "Have a persona from the team's Design Bits research review a diff, a pull request, screenshots or a prototype, and give feedback where every point shows the research it rests on. Use when the user asks what users would think, wants a review from a persona or a panel of personas, or runs /why:persona-review. Simulated by AI, never evidence."
argument-hint: "[persona name | --panel] [#PR | path | screenshot | link]"
---

# Persona review

A persona review is quick, grounded critique before human review. It is simulated by AI: opinion, not evidence, and never a stand-in for real customers.

1. Work out the target: a PR number, the current diff, files or screenshots the user names, or a prototype link.
2. Work out who reviews it:
   - A persona name: one reviewer.
   - `--panel`, or no name: call `persona_brief` with no persona to list them, and use every persona.
3. For each persona, start one `persona-reviewer` subagent (from this plugin), all in parallel. Give each the persona's name, the project, the PR number if there is one, and the target (what to read, which files or screenshots). Each one returns its checked review.
4. Show each review exactly as it comes back, with its label ("Simulated by AI · opinion, not evidence · n of m points rest on research").
5. With a panel, finish with a short "Where they agree" and "Where they differ", using only the points that rest on research.
6. If there is a PR, offer to post the reviews as one comment, using the PR versions (`gh pr comment <n> --body-file -`). Post only when the user says yes. The PR versions cite quote ids, never quotes.

If the change is costly to undo (why-undo says high), end by saying the team should still ask real customers.
