---
name: design-system
description: Use before creating or changing any UI in a design system of this repo (systems/<nome>/: tokens, components, docs page, simulator). Maps the request to the existing ui-* components and tokens of that system, adds a new component to the system first when none fits, and validates with npm run ds:check before it ships.
---

# Usar e estender um design system

Cada sistema vive em `systems/<nome>/`. A referência viva é a página `/systems/<nome>/`
(código em `docs.ts`). Tokens ficam em `tokens.css`; componentes `ui-*` em `components.css`.
O DS Kalion (`systems/kalion/`) é a biblioteca padrão; os outros derivam dele (`base` em
`system.json`). Para criar um sistema novo, use a skill `new-design-system`.

## 1. Mapear antes de escrever

Para cada elemento da tarefa, escolha o componente existente:

| Precisa de | Use |
|---|---|
| Ação, link de ação, CTA | `ui-btn` + `--primary` / `--secondary` / `--outline` / `--ghost` / `--link`, tamanhos `--sm` / `--lg`, `--icon` |
| Rótulo de seção, tag, status | `ui-badge` + `--label` / `--tag` / `--status ui-badge--{success,warning,error,info}` / `--dot` |
| Filtro liga/desliga | `ui-chip` (`aria-pressed`), `--accent`, `--sm` |
| Escolha exclusiva (abas, App/Web) | `ui-segmented` + `ui-segmented__item` (`role="radio"` + `aria-checked`, ou `aria-pressed`) |
| Campo de formulário | `ui-field` + `ui-field__label` + `ui-input` (+ `ui-field__hint`) |
| Card | `ui-card` + `--lead` / `--case` / `--metric` / `--item` |
| Conteúdo expansível | `ui-accordion` (`<details>`) |
| Detalhe ao passar o mouse / foco | `ui-tooltip` |
| Detalhe ao clicar | `ui-popover` + gatilho `<button aria-expanded aria-controls>` |
| Comparar duas imagens | `ui-compare` (+ `--scroll` para capturas altas) |
| Cabeçalho | `ui-navbar` |

Tokens, nunca valores soltos:
- Marca como **fundo**: `bg-accent`. Como **texto, ícone ou foco**: `text-accent-text` /
  `var(--color-accent-text)`. Texto **sobre** a marca: `text-on-accent`.
- Bordas: `var(--color-border)`, `--alpha-10`, `--alpha-15`. Raios: `--radius-base|md|lg|pill`.
- Dentro de `.section-light` os tokens já viram a versão clara; não force cores ali.

## 2. Quando nenhum componente serve

Não invente estilo no HTML. Primeiro estenda o sistema:
1. Adicione a variante ou componente em `systems/<nome>/components.css`, só com tokens, com
   estados `:hover/.is-hover`, `:focus-visible/.is-focus` e desabilitado.
2. Documente na página: entrada em `PAGES` e uma spec em `SPECS` (`docs.ts`) com controles,
   anatomia e tokens; seção em `index.html` com as chaves `ds.*` em PT e EN no
   `translations.json` do sistema.
3. Só então use o componente.

Um token novo entra em `tokens.css` nos dois temas. Nunca remova um token que a base define.

## 3. Validar

```bash
npm run ds:check        # 0 erros para seguir
npm run build
```

`ds:check` acusa: cor inline, hex em classe, opacidade que não gera CSS (`/05`, `/08`), classes
legadas, cor de marca como texto, botão montado com utilitários, seta “→” em texto de botão,
raio fora dos tokens, ícone sem `aria-hidden`, token lido e não definido (`undefined-token`) e
token da base removido (`missing-token`).

Depois confira no navegador: tema claro e escuro, PT e EN, 390px sem rolagem horizontal, foco
visível navegando só com Tab.
