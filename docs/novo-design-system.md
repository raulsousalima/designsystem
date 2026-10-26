# Como criar um novo design system

Cada design system deste repositório é uma pasta em `systems/<nome>/`. Um sistema novo começa
como cópia de outro (por padrão o DS Kalion) e é adaptado a partir da análise de um projeto.

## 1. Analisar o projeto

Junte o material de referência: URLs e telas do site ou app, arquivo do Figma, repositório ou
CSS, capturas de tela. Para cada item, anote o valor observado e o token que ele vira:

- **Cores**: fundo, superfície, texto principal e secundário, cor de marca, semânticas
  (sucesso, alerta, erro, info), nos temas escuro e claro.
- **Tipografia**: famílias de título e de texto, escala de tamanhos, pesos.
- **Forma**: raios de controles e containers, espessura de bordas, sombras.
- **Espaço**: escala de espaçamento, altura de controles, largura máxima do layout.
- **Componentes**: quais padrões do projeto correspondem aos `ui-*` da base, quais pedem uma
  variante nova e quais pedem um componente novo.
- **Simulador**: qual app fictício representa o projeto e qual fluxo ele mostra.

## 2. Criar a pasta

```bash
npm run ds:new -- <slug> --name "DS Nome" --origin "projeto analisado" [--from kalion]
```

O script copia o sistema de origem, troca o nome e os links, marca a versão `0.1.0` com
status `rascunho` e cria `analysis.md` com as tabelas da análise para preencher.

## 3. Adaptar

| Arquivo | O que muda |
|---|---|
| `analysis.md` | O resultado da análise: observado → token → valor, e as decisões. |
| `tokens.css` | Valores dos tokens nos dois temas. Não remova tokens da base; adicione se precisar. |
| `index.html` | Fontes do Google Fonts no `<head>`, banner e textos estáticos. |
| `system.json` | Descrição, origem, nome do simulador e as cores do card da home (`preview`). |
| `components.css` | Variantes ou componentes novos, só com tokens e com estados hover, foco e desabilitado. |
| `docs.ts` | Specs dos componentes novos (`PAGES` e `SPECS`), amostras de cor e tipografia. |
| `translations.json` | Textos da página (`ds.*`) em PT e EN. |
| `simulator.ts` / `simulator.css` | O app fictício do sistema: marca, telas e fluxo. |
| `assets/` | Banner e imagens próprias. |

Regras de contraste do DS Kalion continuam valendo: a cor de marca como texto ou ícone usa
`--color-accent-text` (4.5:1 sobre o fundo), como fundo usa `--color-accent`, e o texto
sobre ela usa `--color-on-accent`.

## 4. Validar

```bash
npm run ds:check   # 0 erros
npm run build
npm run dev        # conferir /systems/<slug>/
```

Confira no navegador: tema claro e escuro, PT e EN, 390px sem rolagem horizontal, foco
visível navegando com Tab e o simulador completo.

## 5. Publicar

Quando estiver pronto, troque `status` em `system.json` de `rascunho` para `estável` e
atualize a versão. O card aparece na home automaticamente.
