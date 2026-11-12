// Which repos Why speaks in on this machine. A repo is linked when it has the needs workflow checked in, or once someone ran
// why-link there. The session note stays silent everywhere else. It
// holds no credentials: it reads local git and one file in Why's state folder.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const STATE = process.env.WHY_STATE_DIR || join(homedir(), '.claude', 'why');
const file = () => join(STATE, 'repos');
const git = (cwd, ...args) => { try { return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 3000 }).trim(); } catch { return ''; } };
const read = () => { try { return readFileSync(file(), 'utf8').split('\n').map(s => s.trim()).filter(Boolean); } catch { return []; } };

// The repo as its remote names it (github.com/acme/rota), so a fresh clone stays linked; its folder when it has no remote.
export function repoOf(cwd) {
  const top = git(cwd, 'rev-parse', '--show-toplevel');
  if (!top) return '';
  const m = git(top, 'remote', 'get-url', 'origin').match(/^(?:[a-z+]+:\/\/)?(?:[^@/]+@)?([^/:]+)[/:](.+?)(?:\.git)?\/?$/i);
  return m ? `${m[1]}/${m[2]}`.toLowerCase() : top;
}

// the needs workflow (docs/why/NEEDS.md) links a repo for everyone who clones it: any workflow that uses the Design Bits needs
// Action, whatever its file is called (`uses: design-bits/needs@v1`)
export const usesAction = text => /design-bits\/needs\b/.test(String(text || ''));
function hasWorkflow(cwd) {
  const top = git(cwd, 'rev-parse', '--show-toplevel');
  if (!top) return false;
  try {
    const dir = join(top, '.github', 'workflows');
    return readdirSync(dir).some(f => /\.ya?ml$/.test(f) && usesAction(readFileSync(join(dir, f), 'utf8')));
  } catch { return false; }
}

export const isLinked = cwd => { const repo = repoOf(cwd); return !!repo && (read().includes(repo) || hasWorkflow(cwd)); };

export function setLinked(cwd, on = true) {
  const repo = repoOf(cwd);
  if (!repo) return '';
  mkdirSync(STATE, { recursive: true });
  writeFileSync(file(), `${[...read().filter(r => r !== repo), ...(on ? [repo] : [])].join('\n')}\n`);
  return repo;
}
