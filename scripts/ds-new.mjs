#!/usr/bin/env node
// Cria um novo design system copiando um existente (por padrão, o DS Kalion).
//   npm run ds:new -- daycoval --name "DS Daycoval"
//   npm run ds:new -- daycoval --name "DS Daycoval" --from kalion --origin "app.daycoval.com.br"
//
// O que a cópia leva: tokens, componentes, página de documentação, traduções,
// simulador e assets. O que muda na hora: system.json (nome, slug, base,
// versão 0.1.0, status "rascunho"), o nome do sistema nos textos e os links
// para systems/<slug>/. O resto (tokens, simulador, textos) é adaptado a
// partir da análise registrada em systems/<slug>/analysis.md.
import { cpSync, existsSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const args = process.argv.slice(2)
const flag = (name) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : undefined
}
const slug = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'))
const from = flag('from') ?? 'kalion'

if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error('Uso: npm run ds:new -- <slug> --name "DS Nome" [--from kalion] [--origin "projeto analisado"]')
  console.error('O slug vira a pasta e a URL (systems/<slug>/): minúsculas, números e hífen.')
  process.exit(1)
}

const src = join(ROOT, 'systems', from)
const dest = join(ROOT, 'systems', slug)
if (!existsSync(join(src, 'system.json'))) { console.error(`Sistema de origem não encontrado: systems/${from}`); process.exit(1) }
if (existsSync(dest)) { console.error(`systems/${slug} já existe. Escolha outro slug ou apague a pasta.`); process.exit(1) }

const base = JSON.parse(readFileSync(join(src, 'system.json'), 'utf8'))
const name = flag('name') ?? `DS ${slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')}`
const origin = flag('origin') ?? 'A definir: projeto analisado'

cpSync(src, dest, { recursive: true, filter: (p) => !p.endsWith('analysis.md') })

// Nome e caminhos do sistema de origem → novo sistema, só em arquivos de texto.
const TEXT = /\.(html|ts|css|json|md)$/
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f)
  return statSync(p).isDirectory() ? walk(p) : [p]
})
for (const file of walk(dest).filter((f) => TEXT.test(f) && !f.endsWith('system.json'))) {
  const text = readFileSync(file, 'utf8')
  const next = text
    .replaceAll(`systems/${from}/`, `systems/${slug}/`)
    .replaceAll(base.name, name)
  if (next !== text) writeFileSync(file, next)
}

const meta = {
  ...base,
  name,
  slug,
  version: '0.1.0',
  status: 'rascunho',
  base: from,
  origin,
  description: {
    pt: `Derivado do ${base.name} a partir da análise de ${origin}.`,
    en: `Derived from ${base.name} by analyzing ${origin}.`,
  },
}
writeFileSync(join(dest, 'system.json'), JSON.stringify(meta, null, 2) + '\n')

writeFileSync(join(dest, 'analysis.md'), `# Análise: ${name}

Projeto analisado: ${origin}
Base: ${base.name} (\`systems/${from}\`)

Preencha cada seção com o que foi observado no projeto e a decisão tomada no
design system. Só registre o que muda em relação à base; o resto é herdado.

## Fontes analisadas

- [ ] Site / app (URLs e telas)
- [ ] Figma
- [ ] Repositório / CSS
- [ ] Capturas de tela

## Cores

| Papel | Observado | Token | Valor escuro | Valor claro |
|---|---|---|---|---|
| Fundo | | \`--color-bg-dark\` | | |
| Superfície | | \`--color-surface\` | | |
| Texto | | \`--color-text-primary-dark\` | | |
| Marca (fundo) | | \`--color-accent\` | | |
| Marca (texto/ícone, 4.5:1) | | \`--color-accent-text\` | | |
| Texto sobre a marca | | \`--color-on-accent\` | | |

## Tipografia

| Papel | Observado | Token | Valor |
|---|---|---|---|
| Títulos | | \`--font-serif\` | |
| Texto | | \`--font-sans\` | |

## Forma e espaço

| Item | Observado | Token | Valor |
|---|---|---|---|
| Raio de controles | | \`--radius-base\` | |
| Raio de containers | | \`--radius-md\` / \`--radius-lg\` | |
| Altura de botão | | \`--control-md\` | |
| Sombras | | \`--shadow-*\` | |

## Componentes

| Padrão no projeto | Componente da base | Ação (usar / variante nova / componente novo) |
|---|---|---|
| | | |

## Simulador

App fictício que representa o projeto: nome, fluxo de telas e o que ele demonstra.

## Decisões e pendências

-
`)

console.log(`✔ systems/${slug} criado a partir de systems/${from} (${name}).`)
console.log('  Próximos passos:')
console.log(`  1. Preencher systems/${slug}/analysis.md`)
console.log(`  2. Ajustar systems/${slug}/tokens.css, system.json (preview) e as fontes no index.html`)
console.log(`  3. Adaptar o simulador (systems/${slug}/simulator.ts) e os textos (translations.json)`)
console.log('  4. npm run ds:check && npm run build')
