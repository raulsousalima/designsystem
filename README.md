# Design Systems

Biblioteca de design systems de Raul Lima. O **DS Kalion** é a biblioteca padrão; cada novo
design system nasce de uma cópia dele, adaptada a partir da análise de outro projeto.

O site lista todos os sistemas em `/`, e cada um tem a própria página de documentação em
`/systems/<nome>/`, com tokens, componentes, playgrounds e um simulador próprio.

## Estrutura

```
index.html, home.ts        Página inicial: lista os sistemas (lê systems/*/system.json)
shared/                    Comum a todos os sistemas
  base.css                 Tailwind + reset mínimo (sem valores visuais próprios)
  docs.css                 Layout da página de documentação (sidebar, playground, overlays)
  home.css                 Estilos da página inicial
  theme.ts, i18n.ts        Tema claro/escuro e PT/EN
  compare.ts               Comportamento do ui-compare
systems/
  kalion/                  DS Kalion, a biblioteca padrão
    system.json            Nome, versão, base, origem, cores do card da home
    tokens.css             Tokens (cores, tipografia, espaço, raios, sombras, movimento)
    components.css         Componentes ui-* (só leem tokens)
    index.html, docs.ts    Página de documentação
    translations.json      Textos da página em PT e EN
    simulator.ts/.css      Simulador (Kalion Bank)
    analysis.md            De onde vieram os padrões deste sistema
    assets/                Imagens da página
scripts/
  ds-new.mjs               Cria um sistema novo a partir de outro
  ds-check.mjs             Verifica uso dos tokens e componentes
docs/novo-design-system.md Passo a passo para criar um sistema a partir de uma análise
.claude/skills/            Skills que orientam o Claude a usar e criar sistemas
```

## Comandos

```bash
npm install
npm run dev                                        # http://localhost:5173
npm run build                                      # gera dist/
npm run ds:check                                   # 0 erros para seguir
npm run ds:new -- daycoval --name "DS Daycoval" --origin "App Daycoval"
```

## Como um sistema novo nasce

1. **Analisar** o projeto (site, app, Figma, repositório ou capturas) e registrar em
   `systems/<nome>/analysis.md`.
2. **Derivar** com `npm run ds:new`, que copia a base para `systems/<nome>/`.
3. **Adaptar** tokens, componentes, textos e o simulador do novo sistema.
4. **Validar** com `npm run ds:check` e `npm run build`, nos temas claro e escuro.

O passo a passo completo está em [`docs/novo-design-system.md`](docs/novo-design-system.md).

## Contrato de tokens

Os componentes `ui-*` só leem `var(--*)`. Um sistema derivado mantém **todos os tokens da base**
e muda só os valores; tokens novos podem ser adicionados. O `ds:check` acusa:

- `missing-token`: o sistema derivado removeu um token que a base define.
- `undefined-token`: um componente ou o simulador lê um token que o sistema não define.

## Deploy

Projeto Vite estático. Na Vercel: build `npm run build`, saída `dist`. Cada sistema vira
`/systems/<nome>/` sem configuração extra (o `vite.config.js` encontra as pastas sozinho).
