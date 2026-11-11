---
name: decide
description: "Write down a product decision in Design Bits, with what it rests on and a tripwire that would change the team's mind. Use when the user decides to build, cut, delay or change something, says \"let's ship it anyway\", or runs /why:decide."
---

# Record a decision

Ask the user, in one message, for what you don't already know:
- what was decided, in one sentence;
- the needs it rests on (keys like N-14, from preflight), if any;
- the feature it is about (its flag, or a PR number in it);
- what would change their mind, as something that can be checked: either a number of mentions in feedback by a date ("more than 5 complaints about it by 10 December") or a date to look again.

Then call `record_decision` with `decided`, `rests_on`, `feature` and `tripwire`:
- mentions: `{ "kind": "mentions", "op": "above" | "below", "n": 5, "by": "YYYY-MM-DD", "text": "…" }`
- a date to look again: `{ "kind": "manual", "by": "YYYY-MM-DD", "text": "…" }`

Tell the user it is recorded and that the tripwire is checked every night. A decision record is a claim about the evidence, never evidence itself.
