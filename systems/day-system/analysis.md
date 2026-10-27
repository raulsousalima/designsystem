# Análise: Day System

Base: DS Kalion (`systems/kalion`)

Projetos analisados (os dois são produtos Daycoval):

| Sigla | Projeto | Repositório | Publicado | Como os dados foram levantados |
|---|---|---|---|---|
| **IB** | Internet Banking (protótipo navegável) | [raulsousalima/prototipo-navegavel](https://github.com/raulsousalima/prototipo-navegavel) | https://prototipo-navegavel.vercel.app/ | Tokens declarados em `src/index.css` (`@theme`) e 24 componentes em `src/design-system/` |
| **PF** | Portal Fiduciário (Custódia, FIDC, Configurações) | [raulsousalima/portal-intern](https://github.com/raulsousalima/portal-intern) | https://portal-intern-eta.vercel.app/home | Código gerado pelo Figma Make, sem tokens: valores contados nas classes (`bg-[#…]`, `rounded-[…]`) e estilos computados nas telas |

Telas capturadas para comparação: IB Início, Investimentos, Portabilidade e Receber Portabilidade;
PF Login, Início, Dashboard de Custódia, Operações Geradas, Boletagem de Ativo e Usuários e Permissões.

Critério quando as duas referências divergem: o **IB** decide os tokens, porque já tem um design
system declarado; o **PF** completa o que o IB não tem (chips de filtro, status sólido, troca de
idioma, tabela densa) e decide a densidade de formulários. Cada divergência está nas tabelas abaixo.

## Cores

Contagem de uso no PF entre parênteses (ocorrências no código).

| Papel | IB | PF | Token | Claro | Escuro (derivado) |
|---|---|---|---|---|---|
| Canvas da página | `canvas` #F1F4F8 | #F5F5F5 (185) | `--color-bg-dark` | #F1F4F8 | #06112F |
| Superfície | `surface` #FFFFFF | #FFFFFF | `--color-surface` | #FFFFFF | #0E1D45 |
| Superfície hover | `brand-50` #EAF5FC (hover de botão) | — | `--color-surface-hover` | #F7F9FC | #142656 |
| Superfície muted | `muted-surface` #E3E7EF | #EBEBEB | `--color-bg-light` | #E3E7EF | #E3E7EF (faixa clara) |
| Borda | `line` #E3E8F0 | #E0E0E0 (209) | `--color-border` | #E3E8F0 | branco 10% |
| Texto principal | `ink` #0E2253 | #001A52 títulos (256), #151515 corpo (195) | `--color-text-primary-dark` | #0E2253 | #F1F4F8 |
| Texto secundário | `ink-muted` #5B6785 | #666666 | `--color-text-muted-dark` | #5B6785 | #A9B3CC |
| Ação principal (navy) | `navy` #0A1E5A, hover `navy-700` #13296B | #001A52 / #001C55 (menu) | `--color-primary` / `--color-primary-hover` | #0A1E5A / #13296B | #FFFFFF / #EAF5FC |
| Texto sobre navy | branco | branco | `--color-on-primary` | #FFFFFF | #0A1E5A |
| Marca Daycoval | `brand` #0086CB | #0088CC (143) | `--color-brand` | #0086CB | #0086CB |
| Marca como fundo de ação | `brand-600` #0077B6 (hover) | — | `--color-accent` | #0077B6 | #0077B6 |
| Marca hover | `brand-700` #006699 | — | `--color-accent-hover` | #006699 | #0086CB |
| Marca suave | `brand-50` #EAF5FC, `brand-100` #D5EBF8 | #C2E4FF (menu ativo), #E8F4FB | `--color-accent-muted`, `--color-accent-2` | #EAF5FC, #D5EBF8 | azul 18%, #D5EBF8 |
| Marca como texto/ícone | `brand` #0086CB | #0088CC | `--color-accent-text` | #006699 | #4DB8EE |
| Desabilitado | `disabled` #DCDFE5, `disabled-ink` #B3B8C4 | #D4D4D4, #A3A3A3 | `--color-disabled`, `--color-disabled-text` | #DCDFE5, #8A93AB | #22325C, #6B7799 |
| Sucesso | `positive` #13A05F / #E6F6EE | #00A378 | `--color-success` / `-bg` | #0E7C49 / #E6F6EE | #34C784 / 15% |
| Alerta | `warning` #F39A4C, `warning-ink` #8A5A00 / #FDF0D9 | #FCB321, #795102 | `--color-warning` / `-bg` | #8A5A00 / #FDF0D9 | #F7B26B / 15% |
| Erro | `negative` #D0312D / #FAD4D6 | #BD0F2C, #FDECEF | `--color-error` / `-bg` | #B3261E / #FAD4D6 | #F07470 / 15% |
| Info | `brand` / `brand-50` | #0A52B9 | `--color-info` / `-bg` | #006699 / #EAF5FC | #4DB8EE / 15% |
| Pictogramas | `picto-green` #2BA562, `indigo` #4B5FB8, `navy` #33449A, `teal` #4F98A6, `red` #D9604C | — | `--color-picto-*` | iguais | iguais |

### Ajustes de contraste (WCAG AA, 4.5:1)

| Combinação observada | Contraste | Decisão |
|---|---|---|
| Texto branco sobre #0086CB (botão "brand", chip ativo) | 3.98:1 | Fundo de ação usa #0077B6 (4.87:1). #0086CB fica em `--color-brand` para superfícies grandes (faixa do cabeçalho), onde o texto é grande. |
| #0086CB como texto sobre o canvas ("Ver tudo", links) | 3.61:1 | `--color-accent-text` = #006699 (5.66:1). |
| #13A05F sobre #E6F6EE ("Concluída") | 3.02:1 | #0E7C49 (4.7:1). |
| #D0312D sobre #FAD4D6 ("Recusada") | 3.72:1 | #B3261E (4.81:1). |
| Branco sobre #00A378 (status sólido PF) | 3.23:1 | Status sólido usa o tom escurecido como fundo. |
| #8A5A00 sobre #FDF0D9 | 5.26:1 | Mantido. |
| #5B6785 sobre #F1F4F8 | 5.11:1 | Mantido. |

### Tema escuro

As duas referências só têm tema claro. O escuro é **derivado** para manter o contrato com a base
(todos os sistemas têm os dois temas): superfícies navy (#06112F, #0E1D45), texto #F1F4F8, marca
como texto #4DB8EE e a ação principal invertida (botão branco com texto navy, como o botão
"light" do IB sobre fundos escuros). A página abre no **claro** (`initTheme('light')`).

## Tipografia

| Item | IB | PF | Decisão | Token |
|---|---|---|---|---|
| Família | Nunito 400–800 | Mulish 400/700 (722 + 570 usos) | **Mulish** (vem do Figma); Nunito como fallback | `--font-sans`, `--font-serif` |
| Serifada | — | — | Sem serifada; `--font-serif` aponta para Mulish | `--font-serif` |
| Título de página | 24px semibold muted ("Saldos") | 32px regular navy ("Hello, Raul!") | 32px regular para título de página, 24px semibold para seção | `--text-4xl`, `--text-2xl` |
| Subtítulo | — | 18px regular #666 | 18px | `--text-lg` |
| Corpo / campos | 16px | 16px | 16px | `--text-base` |
| Tabela, labels | 14px | 14px (594 usos) | 14px | `--text-sm` |
| Metadados, status | 12px | 12px | 12px | `--text-xs` |
| Pesos | 400, 500, 600, 700 | 400, 700 | 400 texto, 600 labels e seções, 700 botões e valores | `--weight-*` |

## Forma

| Item | IB | PF | Decisão | Token |
|---|---|---|---|---|
| Botão | pill (`rounded-full`) | 8px ("Filter"), 4px ("View all") | Pill (IB) | `--radius-pill` |
| Chip | — | pill, 32px | Pill | `--radius-pill` |
| Campo | 16px (`rounded-2xl`) | 8px | 16px (IB) | `--radius-md` |
| Card | 16px (`--radius-card`) | 16px (cards de portal) | 16px | `--radius-md` |
| Painel, tabela, modal | 20px (`--radius-panel`) | 8px (645 usos) | 20px (IB) | `--radius-lg` |
| Status | 6px (`rounded-md`) | pill (sólido) | 6px suave, pill sólido | — |
| Base / pequeno | — | 8px, 4px | 12px e 8px para elementos internos | `--radius-base`, `--radius-sm`, `--radius-xs` |

## Medidas

| Item | IB | PF | Decisão | Token |
|---|---|---|---|---|
| Botão sm / md / lg | 32 / 40 / 60px | 48px ("Filter", "Sign in") | 32 / 40 / 48px | `--control-sm/md/lg` |
| Campo | 64px | 48px | 48px (densidade do PF; o IB fica muito alto em formulários de várias colunas) | `--control-lg` |
| Ícone de navegação | 40px | 56px (menu lateral) | 40px (`ui-btn--icon` md) | `--control-md` |
| Container | 1360px | 1288px de conteúdo em 1440 | 1360px | `--container-max` |

## Elevação

| Item | IB | PF | Token |
|---|---|---|---|
| Card | `0 1px 2px rgb(14 34 83/.04), 0 4px 16px rgb(14 34 83/.04)` | `0 1px 4px rgba(0,0,0,.1)` (111 usos) | `--shadow-md` (IB, navy) |
| Card hover / popover | `0 2px 4px …/.06, 0 10px 28px …/.1` | `0 4px 16px rgba(0,0,0,.12)` | `--shadow-lg` |
| Controle selecionado | — | `0 1px 3px rgba(0,0,0,.15)` | `--shadow-xs` |
| Modal, menu flutuante | — | `0 6px 16px rgba(0,0,0,.12)` | `--shadow-xl` |

## Movimento

| Item | IB | PF | Token |
|---|---|---|---|
| Cor e borda | 150ms | — | `--duration-fast` |
| Card hover (lift 2px) | 200ms | — | `--duration-base` |
| Entrada de conteúdo | fade-up 8px, 400ms, `cubic-bezier(0.22, 1, 0.36, 1)` | fade-up 14px, 650ms, mesma curva | `--duration-reveal`, `--ease-standard` |

## Componentes

### Herdados do DS Kalion e ajustados nesta etapa

| Componente | Referência | O que mudou |
|---|---|---|
| `ui-btn` | IB `Button`, PF botões | Bold 700; 32/40/48px; `--primary` navy; nova `--brand` (azul); `--secondary` = borda neutra do IB; `--outline` = borda azul do PF; `--ghost` e `--link` em azul; desabilitado em cinza sólido (não translúcido). |
| `ui-badge` | IB `Badge`, `StatusBadge`; PF status | `--label` = selo azul de banner; `--tag` neutra; `--status` suave (6px, 12px regular, sem caixa alta); novos `--neutral` e `--solid` (pill preenchido do PF). |
| `ui-chip` | PF Trade Tickets | Borda azul, 32px, 12px bold; selecionado preenchido em azul. |
| `ui-segmented` | PF troca de idioma | Grupo retangular (raio 4px) com item selecionado em azul (`--accent`) ou suave. |
| `ui-field` / `ui-input` | IB `Field`, `TextField`; PF campos | Label 14px semibold sem caixa alta; campo branco, 48px, raio 16px, borda azul no foco; desabilitado em cinza. |
| `ui-card` | IB `Card`; PF cards e resumo | `--lead` = tom suave azul (banner, atalhos); `--case` = superfície branca com sombra e lift de 2px; `--metric` = rótulo acima e valor bold (Saldos, Summary); `--item` mantido (notificações). |
| `ui-tooltip` | IB `title` nativo, menu compacto | Balão navy com texto branco (invertido no escuro). |
| `ui-popover` | IB `Popover` (seletor de contas) | Raio 16px, `--shadow-lg`. |
| `ui-navbar` | PF cabeçalho; IB `UserBar` / `PageBar` | Logo navy quadrado; nova `--brand` (faixa azul do IB). |
| `ui-accordion`, `ui-compare` | — | Só os tokens novos. A página usa o compare para sobrepor as duas referências. |

### Novos, para a próxima etapa

Levantados nas referências e ainda sem equivalente `ui-*`. Ordem sugerida pela frequência de uso.

| Componente | Onde aparece | Observações |
|---|---|---|
| Table (`ui-table`) | IB `DataTable` (portabilidades); PF operações, relatórios | IB: cabeçalho branco bold 14px, linhas 56px, card 20px. PF: cabeçalho cinza escuro #666 com texto branco, linhas zebradas, checkbox por linha. Decidir um padrão e uma variante densa. |
| Select (`ui-select`) | IB `Select` (listbox com rolagem azul); PF selects de filtro | Mesmo visual do campo, chevron azul, lista com borda azul. |
| Tabs (`ui-tabs`) | IB `Tabs` (Todos / Entrada / Saída) | Sublinhado azul de 2px, 56px de altura. |
| Pagination | IB `Pagination`; PF tabelas | Botões 36px raio 8px, atual em `brand-100`, select de itens por página. |
| Radio e Checkbox | IB `RadioGroup` (borda 5px no marcado); PF checkboxes na tabela | Controles nativos estilizados. |
| Alert / InfoBanner | IB `InfoBanner` (fundo muted, ícone info, 12px) | Variantes por tom semântico. |
| Modal (`ui-modal`) | IB `Modal` (`<dialog>`, paginação interna, raio 20px) | Fundo `black/55`, CTA lg de largura total. |
| Sidebar / Rail | IB `Sidebar` (navy, item ativo navy-600); PF `MenuLateral` (trilho de 88px com submenu) | Expandido, compacto (ícones + tooltip) e gaveta no mobile. |
| Avatar | IB `Avatar` (iniciais sobre `brand-100`, anel branco 25%) | Tamanhos 40 / 72px. |
| Pictogram | IB `Pictogram` (quadrado 64px, raio 16px, ícone branco) | Usa `--color-picto-*`. |
| Empty state | IB `EmptyState` | Ícone em quadrado azul suave, título 24px, ações. |
| Money / Trend | IB `Money`, `Trend` (seta + valor + %) | Formatação tabular, cores semânticas, modo "ocultar valores". |
| Quick access card | PF Início (ícone azul, título bold, subtítulo) | Pode virar variante de `ui-card`. |
| Login com addon | PF Login (ícone em caixa à esquerda do campo, olho para senha) | Variante de `ui-field`. |

## Iconografia

As referências usam Lucide (IB) e SVGs exportados do Figma (PF). A página continua com Tabler
(webfont da base). Equivalências dos ícones do IB:

| Lucide | Tabler |
|---|---|
| ArrowRight, ArrowLeft, ArrowUpRight, ArrowDownRight | `arrow-right`, `arrow-left`, `arrow-up-right`, `arrow-down-right` |
| ArrowLeftRight | `arrows-left-right` |
| Bell | `bell` |
| ChevronDown / Left / Right | `chevron-down` / `chevron-left` / `chevron-right` |
| Eye, EyeOff | `eye`, `eye-off` |
| LogOut, LogIn | `logout`, `login` |
| Search, SearchX | `search`, `zoom-cancel` |
| CircleX, X, Check | `circle-x`, `x`, `check` |
| Info, CircleQuestionMark | `info-circle`, `help-circle` |
| SlidersHorizontal | `adjustments-horizontal` |
| FileText, FileCheck, ReceiptText | `file-text`, `file-check`, `receipt` |
| ChartLine, ChartPie, ChartNoAxesColumnIncreasing | `chart-line`, `chart-pie`, `chart-bar` |
| PiggyBank, HandCoins | `pig-money`, `coins` |
| MessageCircle, SendHorizontal | `message-circle`, `send` |
| UserPen, UserRoundSearch | `user-edit`, `user-search` |
| Menu, Trash2, Construction | `menu-2`, `trash`, `barrier-block` |

## Simulador

Nesta etapa a página ainda usa o Kalion Bank da base, já com os tokens e componentes do Day
System. Proposta para o simulador próprio: **Internet Banking Daycoval** com o fluxo
Login → Início (saldos, mais acessados, investimentos) → Investimentos → Portabilidade →
Receber Portabilidade, usando os componentes desta lista.

## Decisões a confirmar

1. **Fonte:** Mulish (Portal/Figma) ou Nunito (Internet Banking)? Escolhida Mulish; trocar é só
   mudar `--font-sans`/`--font-serif` e o link do Google Fonts.
2. **Azul de ação #0077B6 em vez de #0086CB** em botões e chips, para passar em AA com texto branco.
3. **Cabeçalho de tabela:** branco (IB) ou cinza escuro (PF)? Define o `ui-table` da próxima etapa.
4. **Raio de painéis:** 20px (IB) contra 8px (PF). Escolhido 20px.
5. **Altura de campo:** 48px (PF) contra 64px (IB). Escolhido 48px.
6. **Tema escuro:** derivado; validar se os produtos Daycoval terão modo escuro.
