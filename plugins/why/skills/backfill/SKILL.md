---
name: backfill
description: "Record the last weeks of merged pull requests in Design Bits so the board has history from day one. Use right after installing Why, when /why:why says nothing is recorded, or when the user runs /why:backfill."
argument-hint: "[days, default 30]"
---

# Backfill recent merges

1. List merged PRs from the last N days (30 unless the user says otherwise):
   `gh pr list --state merged --search "merged:>=YYYY-MM-DD" --limit 100 --json number,title,headRefName,mergedAt,files`
2. For each PR, call `record_change` with `pr`, `title`, `branch` (headRefName), `mergedAt` (the date), and `paths` (the file paths only). Add a `flag` if the title or branch names one.
3. Don't guess what old PRs rest on. Only add a `suggest` key when the title plainly matches a need from `preflight` (call `preflight` with the PR title to see), and ask the user to confirm those in one batch at the end.
4. Finish with three lines: how many PRs were recorded, the vibes ratio (PRs with no reason recorded), and the board link from `/why:board`.
