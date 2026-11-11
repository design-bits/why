// How costly a change would be to undo, read from the paths it touches and the size of what it deletes. Only a change that is
// costly to undo (pricing, a data migration, a public API, removing a feature, auth, regulated flows) is worth five customer
// calls before it ships; everything else ships and is watched. Pure and import-free on purpose: the Why plugin carries an
// identical copy (plugins/why/lib/undoCost.mjs, held equal by a test) and runs it on the builder's machine, so only the verdict
// and the reason names leave it, never a path or a line of the diff.

// a path segment or file name that starts with one of these words, followed by a separator or the end
const seg = words => new RegExp(`(^|/)(${words})([/._-]|$)`, 'i');

export const COSTLY = [
  { id: 'billing', label: 'pricing, plans or billing', test: seg('billing|pricing|plans?|subscriptions?|payments?|invoices?|checkout|stripe|paddle') },
  { id: 'migration', label: 'a data migration', test: p => seg('migrations?|migrate|schema').test(p) || /\.sql$|firestore\.indexes\.json$/i.test(p) },
  { id: 'api', label: 'a public API', test: p => seg('public-api|openapi|swagger|sdk').test(p) || /(^|\/)api\/v\d+(\/|$)/i.test(p) },
  { id: 'auth', label: 'auth or permissions', test: p => seg('auth|oauth|login|sessions?|permissions?|roles?|acl|rbac').test(p) || /firestore\.rules$/i.test(p) },
  { id: 'regulated', label: 'health, money or legal flows', test: seg('health|medical|hipaa|gdpr|consent|privacy|terms|legal|kyc|tax|payroll') },
  // a removal is read from what the change deletes, not from a name
  { id: 'removal', label: 'removing a feature' },
];

// changes to these never cost a customer anything to undo
const IGNORED = /(^|\/)(tests?|__tests__|spec|fixtures|docs?|\.github)\/|\.(test|spec)\.[jt]sx?$|\.(md|txt|snap)$/i;

// The low-cost kinds of change the checker on the board offers beside the costly ones.
export const EASY = [
  { id: 'ui', label: 'UI, layout or copy' },
  { id: 'flag', label: 'Behind a feature flag' },
  { id: 'view', label: 'A new read-only view' },
  { id: 'refactor', label: 'Refactor or performance' },
];

// `paths` touched, `deleted` files the change removes, and lines `added` and `removed` (git diff --numstat).
// A change removes a feature when it deletes a file that isn't a test or doc, or takes out far more than it adds.
export function undoCost({ paths = [], deleted = [], added = 0, removed = 0 } = {}) {
  const real = paths.filter(p => !IGNORED.test(p));
  const reasons = COSTLY.filter(c => c.test).map(c => ({ id: c.id, label: c.label, paths: real.filter(p => c.test.test ? c.test.test(p) : c.test(p)) }))
    .filter(r => r.paths.length);
  const gone = deleted.filter(p => !IGNORED.test(p));
  if (gone.length || (removed > 200 && removed > 3 * added)) reasons.push({ id: 'removal', label: 'removing a feature', paths: gone });
  return { cost: reasons.length ? 'high' : 'low', reasons: reasons.map(r => ({ ...r, paths: r.paths.slice(0, 3) })) };
}

const listOf = words => (words.length < 2 ? words.join('') : `${words.slice(0, -1).join(', ')} and ${words.at(-1)}`);

// What to do about it, in the words the board, the brief and the plugin all use.
export function verdictOf(u) {
  if (u.cost !== 'high') return { call: false, title: 'Ship it and watch.', text: 'Easy to undo. Label it an experiment, set a tripwire, and Slip will tell you how it landed.' };
  const what = listOf(u.reasons.map(r => r.label));
  return { call: true, title: 'Call five customers first.',
    text: `This touches ${what}, which is costly to undo. Draft five questions for the customers it affects; their answers come back as first-hand evidence in a few days.` };
}

// The checker's own input: the ids someone ticked.
export const costOfIds = ids => {
  const reasons = COSTLY.filter(c => ids.includes(c.id)).map(c => ({ id: c.id, label: c.label, paths: [] }));
  return { cost: reasons.length ? 'high' : 'low', reasons };
};

// `git diff --numstat` lines ("12\t3\tsrc/a.js", "-\t-\tlogo.png" for binaries) as paths and line counts.
export function readNumstat(text) {
  const rows = String(text || '').split('\n').map(l => l.split('\t')).filter(r => r.length >= 3);
  const n = v => (/^\d+$/.test(v) ? Number(v) : 0);
  return { paths: rows.map(r => r.slice(2).join('\t').trim()), added: rows.reduce((s, r) => s + n(r[0]), 0), removed: rows.reduce((s, r) => s + n(r[1]), 0) };
}
