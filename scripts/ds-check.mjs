#!/usr/bin/env node
// Design system check: flags markup that bypasses the tokens / ui-* components
// of each system in systems/<nome>/, and token contracts broken between a
// derived system and its base. Run before shipping UI changes:
//   npm run ds:check            → report, exit 1 on errors
//   npm run ds:check -- --json  → machine-readable output
//   npm run ds:check -- file.html other.html
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const args = process.argv.slice(2)
const asJson = args.includes('--json')
const explicit = args.filter((a) => !a.startsWith('--'))

const LEGACY = new Set(['tag', 'case-card', 'lead-card', 'case-label', 'metric-card', 'metric-value', 'metric-desc',
  'feat-chip', 'rdash-chip', 'rdash-seg', 'heur-item', 'heur-accordion'])

/** Each rule returns [{ line, match }] for one file's text. */
const RULES = [
  {
    id: 'inline-color', level: 'error',
    why: 'Cor escrita no style. Use um token (classe text-*/bg-* ou var(--color-*)).',
    find: (t) => grep(t, /style="[^"]*(?:^|[;\s"])(?:color|background-color)\s*:\s*(?!var\()[^;"]+/g),
  },
  {
    id: 'hex-in-class', level: 'error',
    why: 'Hex em classe arbitrária do Tailwind (ex.: text-[#111]). Use o token correspondente.',
    find: (t) => grep(t, /class="[^"]*\[#[0-9a-fA-F]{3,8}\][^"]*"/g),
  },
  {
    id: 'broken-opacity', level: 'error',
    why: 'Opacidade fora da escala do Tailwind (ex.: /05, /08): a classe não gera CSS.',
    find: (t) => grep(t, /\b(?:bg|text|border|divide|ring)-(?:black|white)\/0\d\b/g),
  },
  {
    id: 'legacy-class', level: 'error',
    why: 'Classe legada removida na migração. Use o componente ui-* equivalente.',
    find: (t) => classTokens(t).filter((c) => LEGACY.has(c.token)),
  },
  {
    id: 'accent-as-text', level: 'error',
    why: 'Lime como texto falha AA no tema claro. Use text-accent-text (texto/ícone) ou bg-accent (fundo).',
    find: (t) => classTokens(t).filter((c) => /^(?:[\w-]+:)*text-accent$/.test(c.token)),
  },
  {
    id: 'adhoc-button', level: 'error',
    why: 'Botão montado com utilitários (bg-accent + padding). Use ui-btn ui-btn--primary.',
    find: (t) => grep(t, /<(?:a|button)\b[^>]*class="(?![^"]*\bui-btn\b)[^"]*\bbg-accent\b[^"]*\bpx-\d[^"]*"/g),
  },
  {
    id: 'arrow-glyph', level: 'error',
    why: 'Seta “→” dentro do texto de link/botão. Use o ícone ti-arrow-right no slot do ui-btn.',
    find: (t) => grep(t, /<(a|button)\b[^>]*>(?:(?!<\/\1>)[\s\S])*?→/g),
  },
  {
    id: 'raw-radius', level: 'error',
    why: 'Raio fora dos tokens. Use rounded-[var(--radius-base|md|lg)] ou o raio do componente.',
    find: (t) => classTokens(t).filter((c) => /^(?:[\w-]+:)*rounded-(?:xl|2xl|3xl)$/.test(c.token)),
  },
  {
    id: 'icon-aria', level: 'warn',
    why: 'Ícone decorativo sem aria-hidden="true" (o leitor de tela lê um caractere vazio).',
    find: (t) => grep(t, /<i class="ti\b(?![^>]*aria-hidden)[^>]*>/g),
  },
]

// Translations: only the text rules apply (values become innerHTML).
const JSON_RULES = new Set(['accent-as-text', 'inline-color', 'hex-in-class'])

function lineOf(text, index) {
  let n = 1
  for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) n++
  return n
}

function grep(text, re) {
  const out = []
  for (const m of text.matchAll(re)) out.push({ line: lineOf(text, m.index), match: m[0].replace(/\s+/g, ' ').slice(0, 110) })
  return out
}

function classTokens(text) {
  const out = []
  for (const m of text.matchAll(/class="([^"]*)"/g)) {
    for (const token of m[1].split(/\s+/).filter(Boolean)) out.push({ token, line: lineOf(text, m.index), match: token })
  }
  return out
}

const SYSTEMS = readdirSync(join(ROOT, 'systems'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(ROOT, 'systems', d.name, 'system.json')))
  .map((d) => d.name)

function defaultFiles() {
  const files = ['index.html']
  for (const s of SYSTEMS) files.push(join('systems', s, 'index.html'), join('systems', s, 'translations.json'))
  return files.filter((f) => existsSync(join(ROOT, f)))
}

/* Token contract, per system:
   - undefined-token: a var(--x) in components.css / simulator.css that neither
     the system nor shared/ defines, in CSS or from script (style="--x:…",
     setProperty('--x')). Fallbacks var(--x, …) are allowed.
   - missing-token: a token the base system defines on :root that the derived
     system dropped, so base components would silently lose a value. */
const read = (rel) => (existsSync(join(ROOT, rel)) ? readFileSync(join(ROOT, rel), 'utf8') : '')
const defined = (text) => new Set([...text.matchAll(/(--[\w-]+)(?:\s*:|'\s*,)/g)].map((m) => m[1]))
const readDir = (dir, re) => readdirSync(join(ROOT, dir)).filter((f) => re.test(f)).map((f) => read(join(dir, f))).join('\n')
const sharedSrc = readDir('shared', /\.(css|ts)$/)

function contractResults() {
  const out = []
  for (const s of SYSTEMS) {
    const dir = join('systems', s)
    const meta = JSON.parse(read(join(dir, 'system.json')))
    const defs = defined(readDir(dir, /\.(css|ts)$/) + sharedSrc)
    for (const file of ['components.css', 'simulator.css']) {
      const text = read(join(dir, file))
      for (const m of text.matchAll(/var\((--[\w-]+)\s*\)/g)) {
        if (defs.has(m[1])) continue
        out.push({ file: join(dir, file), rule: 'undefined-token', level: 'error', line: lineOf(text, m.index), match: m[1] })
      }
    }
    if (meta.base && SYSTEMS.includes(meta.base)) {
      const tokens = read(join(dir, 'tokens.css'))
      const mine = defined(tokens)
      for (const t of defined(read(join('systems', meta.base, 'tokens.css')))) {
        if (!mine.has(t)) out.push({ file: join(dir, 'tokens.css'), rule: 'missing-token', level: 'error', line: 1, match: `${t} (definido em systems/${meta.base}/tokens.css)` })
      }
    }
  }
  return out
}

const files = explicit.length ? explicit : defaultFiles()
const results = []
for (const file of files) {
  const abs = file.startsWith('/') ? file : join(ROOT, file)
  // Strip HTML comments so documentation examples inside them are not flagged.
  const text = readFileSync(abs, 'utf8').replace(/<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, ' '))
  const isJson = abs.endsWith('.json')
  for (const rule of RULES) {
    if (isJson && !JSON_RULES.has(rule.id)) continue
    for (const hit of rule.find(text)) results.push({ file: relative(ROOT, abs), rule: rule.id, level: rule.level, line: hit.line, match: hit.match })
  }
}

if (!explicit.length) results.push(...contractResults())
const CONTRACT_RULES = [
  { id: 'undefined-token', level: 'error', why: 'Componente lê um token que este sistema não define. Declare-o em tokens.css.' },
  { id: 'missing-token', level: 'error', why: 'Sistema derivado removeu um token da base. Mantenha o token (mude só o valor).' },
]

const errors = results.filter((r) => r.level === 'error')
const warns = results.filter((r) => r.level === 'warn')

if (asJson) {
  console.log(JSON.stringify({ files: files.length, errors: errors.length, warnings: warns.length, results }, null, 2))
} else {
  for (const rule of [...RULES, ...CONTRACT_RULES]) {
    const hits = results.filter((r) => r.rule === rule.id)
    if (!hits.length) continue
    console.log(`\n${rule.level === 'error' ? '✖' : '⚠'} ${rule.id} (${hits.length}) — ${rule.why}`)
    for (const h of hits.slice(0, 12)) console.log(`   ${h.file}:${h.line}  ${h.match}`)
    if (hits.length > 12) console.log(`   … e mais ${hits.length - 12}`)
  }
  console.log(`\n${files.length} arquivos · ${errors.length} erros · ${warns.length} avisos`)
}
process.exit(errors.length ? 1 : 0)
