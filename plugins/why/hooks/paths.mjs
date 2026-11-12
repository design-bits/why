#!/usr/bin/env node
// Why's path check in code: before record_change runs, it drops every file path this repo's lists keep on the machine (the lists
// why-paths last kept for this repo, lib/repoRules.mjs) and every secret, .env file or key, whatever the lists say. It hands the
// tool the same arguments with the filtered paths, and decides nothing else, so the normal permission prompt is unchanged. It
// reads local git and Why's state folder only, and sends nothing anywhere. On any error it prints nothing: the server's
// allowedPaths stays the backstop.
// Not yet tried in a real Claude Code session: the docs don't confirm a PreToolUse hook reaches MCP tools, or that updatedInput
// applies without a permission decision. So the skills still filter with why-paths, and copy says the plugin checks paths.
import { readFileSync } from 'node:fs';
import { allowedPaths } from '../lib/pathRules.mjs';
import { rulesFor } from '../lib/repoRules.mjs';

const TOOL = /(^|__)record_change$/;

// The hook's answer for one tool call, or null when it has nothing to change.
export function filterInput(input, lists = {}) {
  const args = input?.tool_input, paths = args?.paths;
  if (!Array.isArray(paths) || (input.tool_name != null && !TOOL.test(String(input.tool_name)))) return null;
  return { hookSpecificOutput: { hookEventName: 'PreToolUse', updatedInput: { ...args, paths: allowedPaths(paths.filter(p => typeof p === 'string'), lists) } } };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const input = JSON.parse(readFileSync(0, 'utf8'));
    const out = filterInput(input, rulesFor(input?.cwd || process.cwd()));
    if (out) process.stdout.write(JSON.stringify(out));
  } catch { /* print nothing: the server filters what arrives */ }
}
