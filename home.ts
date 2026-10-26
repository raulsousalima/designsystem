import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import './shared/base.css'
import './systems/kalion/tokens.css'
import './systems/kalion/components.css'
import './shared/docs.css'
import './shared/home.css'
import { initTheme } from './shared/theme'
import { initI18n, getLang, type Lang, type Translations } from './shared/i18n'

/* =====================================================
   Home: lists every design system in systems/<nome>/system.json.
   Uses DS Kalion (the base library) for its own chrome; each card shows
   the system's own preview colors and fonts from system.json.
   ===================================================== */

interface SystemMeta {
  name: string
  slug: string
  version: string
  status: string
  base: string | null
  origin: string
  description: Record<Lang, string>
  simulator?: string
  preview: { bg: string; surface: string; text: string; accent: string; onAccent: string; fontDisplay: string; fontText: string; radius: string }
}

const systems = Object.values(import.meta.glob<SystemMeta>('./systems/*/system.json', { eager: true, import: 'default' }))
  // Base library first, then derived systems by name.
  .sort((a, b) => Number(a.base !== null) - Number(b.base !== null) || a.name.localeCompare(b.name))

const translations: Translations = {
  pt: {
    'home.label': 'Biblioteca',
    'home.title': 'Design Systems',
    'home.lead': 'Uma biblioteca padrão, o <strong>DS Kalion</strong>, e sistemas derivados dela a partir da análise de outros projetos. Cada design system tem tokens, componentes, documentação e simulador próprios.',
    'home.systems': 'Sistemas',
    'home.how': 'Como nasce um novo sistema',
    'home.step1.t': 'Analisar',
    'home.step1.d': 'Cores, tipografia, raios, espaçamento e componentes do projeto viram um <code>analysis.md</code>.',
    'home.step2.t': 'Derivar',
    'home.step2.d': '<code>npm run ds:new</code> copia a base para <code>systems/&lt;nome&gt;</code>.',
    'home.step3.t': 'Adaptar',
    'home.step3.d': 'Tokens, componentes novos, textos e o simulador do novo sistema.',
    'home.step4.t': 'Validar',
    'home.step4.d': '<code>npm run ds:check</code> e build limpos, temas claro e escuro.',
  },
  en: {
    'home.label': 'Library',
    'home.title': 'Design Systems',
    'home.lead': 'One default library, <strong>DS Kalion</strong>, and systems derived from it by analyzing other projects. Each design system has its own tokens, components, docs and simulator.',
    'home.systems': 'Systems',
    'home.how': 'How a new system is born',
    'home.step1.t': 'Analyze',
    'home.step1.d': 'The project colors, type, radius, spacing and components become an <code>analysis.md</code>.',
    'home.step2.t': 'Derive',
    'home.step2.d': '<code>npm run ds:new</code> copies the base into <code>systems/&lt;name&gt;</code>.',
    'home.step3.t': 'Adapt',
    'home.step3.d': 'Tokens, new components, copy and the new system simulator.',
    'home.step4.t': 'Validate',
    'home.step4.d': 'Clean <code>npm run ds:check</code> and build, light and dark themes.',
  },
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))

function render(lang: Lang) {
  const L = (pt: string, en: string) => (lang === 'pt' ? pt : en)
  const byslug = new Map(systems.map((s) => [s.slug, s.name]))
  const list = document.querySelector<HTMLElement>('[data-systems]')!
  list.innerHTML = systems.map((s) => {
    const p = s.preview
    const vars = `--pv-bg:${p.bg};--pv-surface:${p.surface};--pv-text:${p.text};--pv-accent:${p.accent};--pv-on-accent:${p.onAccent};--pv-display:${p.fontDisplay};--pv-font:${p.fontText};--pv-radius:${p.radius}`
    const lineage = s.base ? L(`Derivado de ${byslug.get(s.base) ?? s.base}`, `Derived from ${byslug.get(s.base) ?? s.base}`) : L('Biblioteca padrão', 'Default library')
    return `<li>
      <a class="ui-card ui-card--case home-card" href="/systems/${esc(s.slug)}/">
        <div class="home-preview" style="${esc(vars)}" aria-hidden="true">
          <span class="home-preview__title">Aa</span>
          <span class="home-preview__btn">${esc(L('Botão', 'Button'))}</span>
          <span class="home-preview__dots"><i></i><i></i><i></i></span>
        </div>
        <div class="ui-card__body">
          <div class="home-card__meta">
            <span class="ui-badge ui-badge--tag ui-badge--sm">v${esc(s.version)}</span>
            <span class="ui-badge ui-badge--tag ui-badge--sm">${esc(lineage)}</span>
          </div>
          <h3 class="ui-card__heading">${esc(s.name)}</h3>
          <p class="ui-card__text">${esc(s.description[lang])}</p>
          <p class="home-card__origin"><i class="ti ti-search" aria-hidden="true"></i> ${esc(s.origin)}</p>
          ${s.simulator ? `<p class="home-card__origin"><i class="ti ti-device-mobile" aria-hidden="true"></i> ${esc(L('Simulador', 'Simulator'))}: ${esc(s.simulator)}</p>` : ''}
        </div>
      </a>
    </li>`
  }).join('')
}

initTheme()
window.addEventListener('langchange', (e) => render((e as CustomEvent<Lang>).detail))
render(getLang())
initI18n(translations)
