// The owner's path lists for each repo on this machine, as why-paths was last given them, so hooks/paths.mjs can apply them to
// record_change without a call to Design Bits. It holds the owner's glob lists only, never a path, and it is sent nowhere: it is
// one file in Why's state folder.
//   paths.json  { "github.com/acme/rota": { "allow": [], "deny": ["infra/**"], "at": "2026-11-12" } }
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { STATE, repoOf } from './link.mjs';

export const rulesFile = () => join(STATE, 'paths.json');
const read = () => { try { const j = JSON.parse(readFileSync(rulesFile(), 'utf8')); return j && typeof j === 'object' && !Array.isArray(j) ? j : {}; } catch { return {}; } };
const globs = l => Array.isArray(l) ? l.filter(g => typeof g === 'string' && g.trim()).map(g => g.trim()) : [];

// The lists for the repo at `cwd`; none when it isn't a repo or nothing usable is kept for it. Never throws.
export function rulesFor(cwd) {
  try {
    const repo = repoOf(cwd), e = repo ? read()[repo] : null;
    return e && typeof e === 'object' ? { allow: globs(e.allow), deny: globs(e.deny) } : { allow: [], deny: [] };
  } catch { return { allow: [], deny: [] }; }
}

// Keeps the lists for the repo at `cwd` and returns the repo, or '' when nothing was kept: outside a repo, or in a read-only
// home, which is fine (the skills still filter, and the server is the backstop). Never throws.
export function keepRules(cwd, { allow = [], deny = [] } = {}) {
  try {
    const repo = repoOf(cwd);
    if (!repo) return '';
    mkdirSync(STATE, { recursive: true });
    const all = { ...read(), [repo]: { allow: globs(allow), deny: globs(deny), at: new Date().toISOString().slice(0, 10) } };
    writeFileSync(rulesFile(), `${JSON.stringify(all, null, 2)}\n`, { mode: 0o600 });
    return repo;
  } catch { return ''; }
}
