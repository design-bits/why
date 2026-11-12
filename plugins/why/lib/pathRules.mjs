// Which file paths may leave a builder's machine: the ones the project's owner allows, minus the ones they deny, and never
// secrets, .env files or keys, whatever the lists say. Pure and import-free on purpose: the Why plugin carries an identical
// copy (plugins/why/lib/pathRules.mjs, held equal by a test) and filters with it before anything is sent; the server runs this
// one again on what arrives, as a backstop.

export const NEVER = ['**/.env*', '**/secrets/**', '**/*.pem', '**/*.key', '**/id_rsa*'];

// a glob as a whole-path pattern: ** crosses folders, * and ? stay inside one
export const glob = g => new RegExp(`^${g.split(/(\*\*\/|\*\*|\*|\?)/).map(t => ({ '**/': '(?:.*/)?', '**': '.*', '*': '[^/]*', '?': '[^/]' })[t]
  ?? t.replace(/[.+^${}()|[\]\\]/g, '\\$&')).join('')}$`);

// `settings` is the project's { allow, deny }: an empty allow list allows everything.
export function allowedPaths(list, settings = {}) {
  const allow = (settings.allow?.length ? settings.allow : ['**']).map(glob), deny = [...NEVER, ...(settings.deny || [])].map(glob);
  return list.filter(p => allow.some(r => r.test(p)) && !deny.some(r => r.test(p)));
}
