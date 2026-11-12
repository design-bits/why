#!/usr/bin/env node
// Why's one note at session start. It reads local git (the branch) and tells Claude to use the brief skill once before building.
// It holds no credentials and sends nothing anywhere: the brief itself comes through the Design Bits MCP connection, which signs
// in on its own. It speaks only in repos Why is linked to (lib/link.mjs), says nothing after a compaction, and nothing at all
// once someone has run why-quiet.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { STATE, isLinked } from '../lib/link.mjs';

export { STATE };
const read = () => { try { return JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { return {}; } };
const git = (cwd, ...args) => { try { return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 3000 }).trim(); } catch { return ''; } };

// The note for a session in `cwd`, or '' when Why should stay quiet.
export function noteFor({ cwd = process.cwd(), source = 'startup' } = {}) {
  if (source === 'compact' || existsSync(join(STATE, 'quiet')) || !isLinked(cwd)) return '';
  if (!git(cwd, 'rev-parse', '--abbrev-ref', 'HEAD')) return '';
  return 'Design Bits is linked to this repo. Before writing code for a ticket, use the brief skill once. Say nothing if it returns nothing.';
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const input = read();
  const note = noteFor({ cwd: input.cwd || process.cwd(), source: input.source });
  if (note) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: note } }));
}
