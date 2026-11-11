#!/usr/bin/env node
// Why's one note at session start. It reads local git (the branch, a ticket key in it, the last merge) and tells Claude to brief
// itself with preflight before building. It holds no credentials and sends nothing anywhere: the brief itself comes through the
// Design Bits MCP connection, which signs in on its own. It says nothing after a compaction, and nothing at all once someone
// has run why-quiet. Once a week it also suggests the landing report.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const STATE = process.env.WHY_STATE_DIR || join(homedir(), '.claude', 'why');
const read = () => { try { return JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { return {}; } };
const git = (cwd, ...args) => { try { return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 3000 }).trim(); } catch { return ''; } };

// The note for a session in `cwd`, or '' when Why should stay quiet.
export function noteFor({ cwd = process.cwd(), source = 'startup', project = '', today = new Date().toISOString().slice(0, 10) } = {}) {
  if (source === 'compact' || existsSync(join(STATE, 'quiet'))) return '';
  const branch = git(cwd, 'rev-parse', '--abbrev-ref', 'HEAD');
  if (!branch) return '';
  const ticket = (branch.match(/([A-Za-z]{2,10}-\d{1,6})/) || [])[1]?.toUpperCase() || '';
  const lines = [`Why (Design Bits) is on in this repo${project ? `, reading the project "${project}" (pass it as \`project\` to the designbits tools)` : ''}.`];
  if (!['main', 'master', 'trunk', 'develop', 'HEAD'].includes(branch)) {
    lines.push(`You are on branch ${branch}${ticket ? `, ticket ${ticket}` : ''}. Before writing code for it, use the why:preflight skill once to learn who needs this work, then build from their words. Show its brief in 15 lines or fewer, and say nothing about Why if nothing matches.`);
  } else {
    lines.push('When the user starts on a ticket, use the why:preflight skill once before building. When they open a pull request, use why:ship-with-receipt.');
  }
  // the landing report, at most once a week
  const last = (() => { try { return readFileSync(join(STATE, 'last-landing'), 'utf8').trim(); } catch { return ''; } })();
  if (!last || Date.parse(today) - Date.parse(last) >= 6 * 864e5) {
    lines.push('It has been a week: offer the why:landing report once, in three lines, if the user wants it.');
    try { mkdirSync(STATE, { recursive: true }); writeFileSync(join(STATE, 'last-landing'), today); } catch { /* a read-only home: say it again next time */ }
  }
  lines.push('Never block or nag: Why labels work, it never stops it. The user can silence this note with why-quiet.');
  return lines.join(' ');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const input = read();
  const note = noteFor({ cwd: input.cwd || process.cwd(), source: input.source, project: process.env.CLAUDE_PLUGIN_OPTION_PROJECT || '' });
  if (note) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: note } }));
}
