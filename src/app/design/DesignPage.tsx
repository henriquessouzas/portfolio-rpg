import { ObjectArt, Hero, Crest } from '@/components/rpg/art';
import { Button } from '@/components/rpg/ui/button';
import { ThemeToggle } from '@/components/rpg/theme-toggle';
import { LangToggle } from '@/components/rpg/lang-toggle';
import { LangProvider } from '@/hooks/use-lang';

// ─── helpers ────────────────────────────────────────────────────────────────

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 64 }}>
      <h2 style={{ font: '10px/2 var(--font-pixel)', marginBottom: 24, borderBottom: '2px solid var(--outline)', paddingBottom: 10 }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ gap = 16, wrap = true, children }: { gap?: number; wrap?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: wrap ? 'wrap' : 'nowrap', gap, alignItems: 'flex-start' }}>
      {children}
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
      <div style={{ width: 48, height: 48, background: `var(--${value})`, border: '2px solid var(--outline)' }} />
      <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>{label}</span>
      <span style={{ fontSize: 10, color: 'var(--muted-foreground)', fontFamily: 'monospace' }}>--{value}</span>
    </div>
  );
}

function TokenRow({ name, value }: { name: string; value: string }) {
  return (
    <tr>
      <td style={{ padding: '7px 14px 7px 0', fontFamily: 'monospace', fontSize: 13, color: 'var(--mana)' }}>{name}</td>
      <td style={{ padding: '7px 0', fontSize: 13, color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>{value}</td>
    </tr>
  );
}

// ─── nav ────────────────────────────────────────────────────────────────────

const NAV = [
  ['colors', 'Cores'],
  ['tokens', 'Tokens'],
  ['typography', 'Tipografia'],
  ['icons', 'Ícones'],
  ['hero', 'Herói & Brasão'],
  ['buttons', 'Botões'],
  ['toggles', 'Toggles'],
  ['shadows', 'Sombras'],
  ['animations', 'Animações'],
];

// ─── data ───────────────────────────────────────────────────────────────────

const PALETTE = [
  ['gold / primary', 'gold'],
  ['mana', 'mana'],
  ['ember', 'ember'],
  ['forest', 'forest'],
  ['royal', 'royal'],
  ['wood', 'wood'],
  ['steel', 'steel'],
  ['skin', 'skin'],
  ['stone', 'stone'],
  ['stone-dark', 'stone-dark'],
  ['floor', 'floor'],
  ['floor-dark', 'floor-dark'],
  ['ink / outline', 'ink'],
  ['surface', 'surface'],
  ['background', 'background'],
];

const SEMANTIC = [
  ['foreground', 'foreground'],
  ['muted', 'muted'],
  ['muted-foreground', 'muted-foreground'],
  ['accent', 'accent'],
  ['scene-ink', 'scene-ink'],
  ['scene-shade', 'scene-shade'],
];

const ICONS = [
  'sword','shield','bow','anvil','book','books','scroll',
  'throne','trophy','letter','bed','desk','poster','chest',
  'potion','flask','cauldron','orb',
];

const TOKENS = [
  ['--tile', '16px — unidade base de pixel art'],
  ['--font-pixel', "'Press Start 2P', monospace"],
  ['--font-sans', "'Source Sans 3', sans-serif"],
  ['--shadow-pixel', '4px 4px 0 var(--outline)'],
  ['--shadow-scene', '6px 6px 0 var(--outline)'],
  ['--radius-sm / md / lg', '0 — sem arredondamento'],
];

// ─── component ──────────────────────────────────────────────────────────────

export default function DesignPage() {
  return (
    <LangProvider>
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--surface)', borderBottom: '3px solid var(--outline)',
        padding: '0 48px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 24, minHeight: 56,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Crest />
          <span style={{ font: '10px/1 var(--font-pixel)' }}>Design System</span>
        </div>
        <nav style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} style={{
              font: '11px/1 var(--font-sans)', padding: '6px 10px',
              color: 'var(--muted-foreground)', textDecoration: 'none',
              border: '1px solid transparent',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--outline)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
            >{label}</a>
          ))}
        </nav>
        <a href="/" style={{ font: '11px/1 var(--font-sans)', color: 'var(--muted-foreground)', textDecoration: 'none' }}>
          ← Voltar
        </a>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 48px 96px' }}>
        <h1 style={{ font: '20px/1.6 var(--font-pixel)', marginBottom: 8 }}>Design System</h1>
        <p style={{ fontSize: 17, color: 'var(--muted-foreground)', marginBottom: 56, fontFamily: 'var(--font-sans)' }}>
          Tokens, cores, tipografia, ícones e componentes do Portfólio RPG.
        </p>

        {/* ── CORES ── */}
        <Section id="colors" title="Cores">
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginBottom: 24, fontFamily: 'var(--font-sans)' }}>
            Paleta principal — acessível via <code style={{ fontFamily: 'monospace' }}>var(--nome)</code> e classes utilitárias <code style={{ fontFamily: 'monospace' }}>.fill-*</code> / <code style={{ fontFamily: 'monospace' }}>.stroke-*</code>.
          </p>
          <Row gap={20}>
            {PALETTE.map(([label, value]) => (
              <Chip key={value} label={label} value={value} />
            ))}
          </Row>
          <h3 style={{ font: '9px/2 var(--font-pixel)', marginTop: 36, marginBottom: 16 }}>Semânticas</h3>
          <Row gap={20}>
            {SEMANTIC.map(([label, value]) => (
              <Chip key={value} label={label} value={value} />
            ))}
          </Row>
          <h3 style={{ font: '9px/2 var(--font-pixel)', marginTop: 36, marginBottom: 16 }}>Cores de sala (--room-color)</h3>
          <Row gap={20}>
            {[
              ['Biblioteca (B)', 'forest'],
              ['Sala do Trono (T)', 'gold'],
              ['Aposentos (A)', 'royal'],
              ['Arsenal (R)', 'ember'],
              ['Laboratório (L)', 'mana'],
            ].map(([label, value]) => (
              <Chip key={value} label={label} value={value} />
            ))}
          </Row>
        </Section>

        {/* ── TOKENS ── */}
        <Section id="tokens" title="Tokens">
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              {TOKENS.map(([name, value]) => (
                <TokenRow key={name} name={name} value={value} />
              ))}
            </tbody>
          </table>
          <h3 style={{ font: '9px/2 var(--font-pixel)', marginTop: 32, marginBottom: 12 }}>--tile: 16px</h3>
          <Row gap={12} wrap={false}>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: `calc(var(--tile) * ${n})`,
                  height: `calc(var(--tile) * ${n})`,
                  background: 'var(--mana)',
                  border: '2px solid var(--outline)',
                  imageRendering: 'pixelated',
                }} />
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--muted-foreground)' }}>×{n}</span>
              </div>
            ))}
          </Row>
        </Section>

        {/* ── TIPOGRAFIA ── */}
        <Section id="typography" title="Tipografia">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 8, fontFamily: 'var(--font-sans)' }}>
                --font-pixel · Press Start 2P
              </div>
              {[
                { size: '29px', label: 'Heading 1 — intro h1' },
                { size: '23px', label: 'Heading 1 — game-heading h1' },
                { size: '20px', label: 'Heading 1 — mobile' },
                { size: '14px', label: 'Heading 2 — exploration-log h2' },
                { size: '13px', label: 'Heading 2 — dialogue-content h2' },
                { size: '12px', label: 'Heading 2 — shelf-head h2' },
                { size: '10px', label: 'Heading 3 — book-detail h3 (mínimo pixel)' },
              ].map(({ size, label }) => (
                <div key={size} style={{ marginBottom: 12 }}>
                  <span style={{ fontFamily: 'var(--font-pixel)', fontSize: size }}>Portfólio RPG</span>
                  <span style={{ fontSize: 12, color: 'var(--muted-foreground)', marginLeft: 16, fontFamily: 'var(--font-sans)' }}>
                    {size} — {label}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 8, fontFamily: 'var(--font-sans)' }}>
                --font-sans · Source Sans 3 (textos longos e labels pequenos)
              </div>
              {[
                { size: '17px', weight: 400, label: 'Body — padrão' },
                { size: '17px', weight: 600, label: 'Body bold' },
                { size: '15px', weight: 400, label: 'Body small' },
                { size: '13px', weight: 400, label: 'Caption / meta' },
                { size: '12px', weight: 400, label: 'Label mínimo' },
                { size: '11px', weight: 400, label: 'Label pixel-style (sans)' },
              ].map(({ size, weight, label }) => (
                <div key={size + weight} style={{ marginBottom: 10 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: size, fontWeight: weight }}>
                    O herói atravessa o castelo em busca de conhecimento.
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--muted-foreground)', marginLeft: 16, fontFamily: 'var(--font-sans)' }}>
                    {size} {weight !== 400 ? `w${weight}` : ''} — {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── ÍCONES ── */}
        <Section id="icons" title="Ícones de objeto (ObjectArt)">
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginBottom: 24, fontFamily: 'var(--font-sans)' }}>
            SVG 64×64 · <code style={{ fontFamily: 'monospace' }}>shapeRendering="crispEdges"</code> · prop <code style={{ fontFamily: 'monospace' }}>kind</code>
          </p>
          <Row gap={24}>
            {ICONS.map(kind => (
              <div key={kind} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 72, height: 72,
                  display: 'grid', placeItems: 'center',
                  background: 'var(--surface)',
                  border: '2px solid var(--outline)',
                }}>
                  <ObjectArt kind={kind} />
                </div>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--muted-foreground)' }}>{kind}</span>
              </div>
            ))}
          </Row>
          <h3 style={{ font: '9px/2 var(--font-pixel)', marginTop: 36, marginBottom: 16 }}>Tamanhos via --tile</h3>
          <Row gap={24} wrap={false}>
            {[2, 3, 4, 5].map(n => (
              <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: `calc(var(--tile) * ${n})`,
                  height: `calc(var(--tile) * ${n})`,
                  display: 'grid', placeItems: 'center',
                  background: 'var(--surface)', border: '2px solid var(--outline)',
                }}>
                  <ObjectArt kind="sword" className="" style={{ width: '100%', height: '100%' }} />
                </div>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--muted-foreground)' }}>
                  ×{n} = {n * 16}px
                </span>
              </div>
            ))}
          </Row>
        </Section>

        {/* ── HERÓI & BRASÃO ── */}
        <Section id="hero" title="Herói & Brasão">
          <Row gap={40}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>Hero — parado</div>
              <div style={{ width: 64, height: 86, display: 'grid', placeItems: 'center', background: 'var(--floor)', border: '2px solid var(--outline)' }}>
                <Hero walking={false} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>Hero — walking</div>
              <div style={{ width: 64, height: 86, display: 'grid', placeItems: 'center', background: 'var(--floor)', border: '2px solid var(--outline)' }}>
                <Hero walking={true} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>Hero — HUD (32px = ×2)</div>
              <div style={{ width: 48, height: 48, display: 'grid', placeItems: 'center', background: 'var(--floor)', border: '2px solid var(--outline)' }}>
                <div style={{ width: 'calc(var(--tile) * 2)', height: 'calc(var(--tile) * 2.7)' }}>
                  <Hero />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>Crest</div>
              <div style={{ width: 64, height: 64, display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '2px solid var(--outline)' }}>
                <Crest />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>Crest — footer (18px)</div>
              <div style={{ width: 48, height: 48, display: 'grid', placeItems: 'center', background: 'var(--surface)', border: '2px solid var(--outline)' }}>
                <Crest style={{ width: 18, height: 22 }} />
              </div>
            </div>
          </Row>
        </Section>

        {/* ── BOTÕES ── */}
        <Section id="buttons" title="Botões">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 12, fontFamily: 'var(--font-sans)' }}>
                variant="pixel" — ação primária (CTA)
              </div>
              <Row gap={12}>
                <Button variant="pixel">Entrar no castelo</Button>
                <Button variant="pixel" disabled>Desabilitado</Button>
              </Row>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 12, fontFamily: 'var(--font-sans)' }}>
                variant="parchment" — ação secundária
              </div>
              <Row gap={12}>
                <Button variant="parchment">Pular o jogo</Button>
                <Button variant="parchment" disabled>Desabilitado</Button>
              </Row>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 12, fontFamily: 'var(--font-sans)' }}>
                variant="room" — label de sala no mapa
              </div>
              <Row gap={12}>
                <Button variant="room">Biblioteca</Button>
                <Button variant="room" className="map-room-active">Arsenal</Button>
              </Row>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 12, fontFamily: 'var(--font-sans)' }}>
                Tags / badges
              </div>
              <div className="tags">
                {['React', 'TypeScript', 'Python', 'SQL', 'Node.js', 'Git'].map(t => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 12, fontFamily: 'var(--font-sans)' }}>
                .book-link — link de ação na estante
              </div>
              <Row gap={12}>
                <a href="#" className="book-link">Ver projeto</a>
                <a href="#" className="book-link" style={{ background: 'var(--mana)', color: 'var(--surface)' }}>Ver PDF</a>
              </Row>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 12, fontFamily: 'var(--font-sans)' }}>
                .tech-search-chip — filtro de categoria
              </div>
              <Row gap={8}>
                {['Todos', 'Linguagens', 'Front-end', 'Back-end', 'Dados', 'Ferramentas'].map((c, i) => (
                  <button key={c} className="tech-search-chip" aria-pressed={i === 0}>{c}</button>
                ))}
              </Row>
            </div>
          </div>
        </Section>

        {/* ── TOGGLES ── */}
        <Section id="toggles" title="Toggles">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 12, fontFamily: 'var(--font-sans)' }}>
                ThemeToggle — seletor de tema (Claro / Escuro)
              </div>
              <ThemeToggle />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 12, fontFamily: 'var(--font-sans)' }}>
                LangToggle — alternador de idioma (PT ↔ EN)
              </div>
              <LangToggle />
            </div>
          </div>
        </Section>

        {/* ── SOMBRAS ── */}
        <Section id="shadows" title="Sombras & Bordas">
          <Row gap={40}>
            {[
              { label: '--shadow-pixel', shadow: 'var(--shadow-pixel)', size: 80 },
              { label: '--shadow-scene', shadow: 'var(--shadow-scene)', size: 100 },
            ].map(({ label, shadow, size }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{
                  width: size, height: size,
                  background: 'var(--surface)',
                  border: '3px solid var(--outline)',
                  boxShadow: shadow,
                }} />
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--muted-foreground)' }}>{label}</span>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                width: 100, height: 100,
                background: 'var(--surface)',
                border: '3px solid var(--outline)',
                outline: '3px solid var(--mana)',
                outlineOffset: 5,
              }} />
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--muted-foreground)' }}>:focus-visible</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                width: 100, height: 100,
                background: 'var(--surface)',
                border: '2px solid var(--outline)',
                boxShadow: '2px 2px 0 var(--outline)',
              }} />
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--muted-foreground)' }}>popup / card</span>
            </div>
          </Row>
        </Section>

        {/* ── ANIMAÇÕES ── */}
        <Section id="animations" title="Animações">
          <Row gap={40}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, display: 'grid', placeItems: 'center', background: 'var(--floor)', border: '2px solid var(--outline)' }}>
                <Hero walking={true} />
              </div>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-sans)', color: 'var(--muted-foreground)' }}>hero-step · 0.24s steps(2)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 64 64" shapeRendering="crispEdges">
                <path d={`M26 54l12-25 12 15 8-27 20 34 12-10 16 13z`} className="fill-ember torch" />
              </svg>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-sans)', color: 'var(--muted-foreground)' }}>flame · 0.8s steps(3)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, display: 'grid', placeItems: 'center' }}>
                <div style={{
                  width: 2, height: '1em', fontSize: 24,
                  background: 'var(--foreground)',
                  animation: 'tw-blink 0.7s steps(1) infinite',
                }} />
              </div>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-sans)', color: 'var(--muted-foreground)' }}>tw-blink · 0.7s steps(1)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 48 48">
                <ellipse cx="24" cy="24" rx="18" ry="6" fill="none" className="stroke-gold"
                  strokeWidth="2"
                  style={{ animation: 'map-spin 4s linear infinite', transformBox: 'fill-box', transformOrigin: 'center' }}
                />
              </svg>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-sans)', color: 'var(--muted-foreground)' }}>map-spin · linear infinite</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="14" fill="none" className="stroke-mana map-water-ripple" strokeWidth="2" />
              </svg>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-sans)', color: 'var(--muted-foreground)' }}>fountain-ripple · 2.2s ease</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, display: 'grid', placeItems: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 32 32">
                  <path d="M8 28q-8-5 0-10q-8-5 0-10" fill="none" className="stroke-forest alchemy-steam" strokeWidth="4" />
                </svg>
              </div>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-sans)', color: 'var(--muted-foreground)' }}>steam · 2.4s ease-in-out</span>
            </div>
          </Row>
          <div style={{ marginTop: 32, padding: 16, background: 'var(--surface)', border: '2px solid var(--outline)', fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--muted-foreground)' }}>
            <strong style={{ color: 'var(--foreground)' }}>prefers-reduced-motion: reduce</strong> — todas as animações e transições são desativadas via <code style={{ fontFamily: 'monospace' }}>animation: none !important</code>.
          </div>
        </Section>
      </main>
    </div>
    </LangProvider>
  );
}
