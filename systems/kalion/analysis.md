# Análise: DS Kalion

Projeto analisado: portfólio Raul Lima ([raulsousalima/about](https://github.com/raulsousalima/about))
Base: nenhuma (biblioteca padrão)

O DS Kalion nasceu do próprio portfólio. Os padrões que já existiam espalhados pelas páginas
(botões, tags, cards, filtros, toggles) foram mapeados, normalizados em tokens e transformados
em componentes `ui-*` com variantes, estados e anatomia documentados.

## Cores

| Papel | Token | Escuro | Claro |
|---|---|---|---|
| Fundo | `--color-bg-dark` | `#111111` | `#FAFAFA` |
| Superfície | `--color-surface` | `#1A1A1A` | `#FFFFFF` |
| Texto | `--color-text-primary-dark` | `#F4F4F4` | `#111111` |
| Marca (fundo) | `--color-accent` | `#C8F04E` | `#A7D226` |
| Marca (texto/ícone) | `--color-accent-text` | `#C8F04E` | `#4F6B00` |
| Texto sobre a marca | `--color-on-accent` | `#111111` | `#111111` |

## Tipografia

| Papel | Token | Valor |
|---|---|---|
| Títulos | `--font-serif` | Playfair Display |
| Texto | `--font-sans` | Inter |

## Forma e espaço

Escala de espaço de 4px, raios `--radius-xs` a `--radius-lg` mais `--radius-pill`, controles
de 36, 44 e 56px. Valores completos em `tokens.css`.

## Componentes

Button, Badge, Chip, Segmented Control, Input, Card, Accordion, Tooltip, Popover, Compare e
Navbar, documentados em `/systems/kalion/`.

## Simulador

Kalion Bank: app financeiro fictício com o fluxo Splash, Acesso, Login (PIN `123456`) e Home,
com painel para trocar cor de marca, fonte, escala de texto, espaço e raio ao vivo.

## Histórico

Migrado do repositório About (`designsystem.html`, `src/components.css` e os tokens de
`src/index.css`), onde o plano de migração do site está em `docs/design-system-migration.md`.
