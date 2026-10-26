---
name: new-design-system
description: Use when asked to analyze a project (site, app, Figma, repository or screenshots) and create a new design system from it, or to derive a new library from DS Kalion or another system in systems/. Runs the analysis, scaffolds systems/<nome> with npm run ds:new, adapts tokens, components, docs and simulator, and validates.
---

# Criar um design system a partir de uma análise

Guia completo: `docs/novo-design-system.md`. Resumo do fluxo:

## 1. Análise primeiro

Antes de tocar em código, levante do projeto de referência: cores (escuro e claro), fontes,
escala de texto, raios, bordas, sombras, espaçamento, alturas de controle e os padrões de
componentes. Use o que estiver disponível: URL (navegador/Playwright para capturar estilos
computados), Figma (variáveis e estilos), repositório (CSS, tema, config do Tailwind) ou
capturas de tela. Não chute valores: registre o observado e de onde veio.

Confirme com o usuário o nome do sistema (ex.: "DS Daycoval") e o slug (ex.: `daycoval`) se
não foram dados.

## 2. Criar a pasta

```bash
npm run ds:new -- <slug> --name "DS Nome" --origin "<projeto analisado>" [--from kalion]
```

## 3. Preencher `systems/<slug>/analysis.md`

Uma linha por decisão: observado → token → valor escuro/claro. Liste os componentes do projeto
e a ação para cada um (usar o `ui-*` existente, variante nova ou componente novo).

## 4. Adaptar

- `tokens.css`: troque valores; mantenha todos os tokens da base. Verifique contraste:
  `--color-accent-text` e texto principal com 4.5:1 sobre o fundo, nos dois temas;
  `--color-on-accent` legível sobre `--color-accent`.
- `index.html`: link do Google Fonts das fontes novas, banner (`assets/banner.png`) e textos.
- `system.json`: descrição PT/EN, `origin`, `simulator` e `preview` (cores e fontes do card).
- `components.css` + `docs.ts` + `translations.json`: variantes e componentes novos,
  documentados (ver skill `design-system`).
- `simulator.ts` / `simulator.css`: transforme o app fictício no do novo sistema (nome, ícone,
  telas e fluxo que representam o projeto analisado), usando só `ui-*` e tokens.

## 5. Validar e entregar

```bash
npm run ds:check && npm run build
```

Capture `/systems/<slug>/` nos dois temas, em 1440px e 390px, incluindo o simulador, e
compare com o projeto analisado. Mantenha `status: "rascunho"` até o usuário aprovar.
