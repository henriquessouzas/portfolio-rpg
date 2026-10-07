type CastleSvgProps = {
  drawbridgeOpen: boolean;
};

export function CastleSvg({ drawbridgeOpen }: CastleSvgProps) {
  const ink = 'var(--line)';
  const wall = 'var(--surface)';
  const gate = 'var(--ink)';
  const water = 'var(--mana)';
  const flag = 'var(--ember)';
  const bridge = 'var(--gold)';

  return (
    <svg
      viewBox="0 0 200 160"
      aria-hidden="true"
      style={{ width: '100%', maxWidth: 320, display: 'block' }}
      shapeRendering="crispEdges"
    >
      {/* ── Fosso ── */}
      <rect x="10" y="130" width="180" height="20" fill={water} stroke={ink} strokeWidth="2" />

      {/* ── Torre esquerda ── */}
      <rect x="20" y="60" width="40" height="75" fill={wall} stroke={ink} strokeWidth="2" />
      {/* ameias torre esquerda */}
      <rect x="20" y="52" width="8" height="12" fill={wall} stroke={ink} strokeWidth="2" />
      <rect x="32" y="52" width="8" height="12" fill={wall} stroke={ink} strokeWidth="2" />
      <rect x="44" y="52" width="8" height="12" fill={wall} stroke={ink} strokeWidth="2" />
      {/* janela torre esquerda */}
      <rect x="33" y="80" width="14" height="18" fill={gate} stroke={ink} strokeWidth="2" />
      {/* bandeira esquerda */}
      <line x1="40" y1="52" x2="40" y2="30" stroke={ink} strokeWidth="2" />
      <polygon points="40,30 56,37 40,44" fill={flag} stroke={ink} strokeWidth="1.5" />

      {/* ── Torre direita ── */}
      <rect x="140" y="60" width="40" height="75" fill={wall} stroke={ink} strokeWidth="2" />
      {/* ameias torre direita */}
      <rect x="140" y="52" width="8" height="12" fill={wall} stroke={ink} strokeWidth="2" />
      <rect x="152" y="52" width="8" height="12" fill={wall} stroke={ink} strokeWidth="2" />
      <rect x="164" y="52" width="8" height="12" fill={wall} stroke={ink} strokeWidth="2" />
      {/* janela torre direita */}
      <rect x="153" y="80" width="14" height="18" fill={gate} stroke={ink} strokeWidth="2" />
      {/* bandeira direita */}
      <line x1="160" y1="52" x2="160" y2="30" stroke={ink} strokeWidth="2" />
      <polygon points="160,30 144,37 160,44" fill={flag} stroke={ink} strokeWidth="1.5" />

      {/* ── Corpo central ── */}
      <rect x="60" y="40" width="80" height="95" fill={wall} stroke={ink} strokeWidth="2" />
      {/* ameias centrais */}
      <rect x="60" y="30" width="10" height="14" fill={wall} stroke={ink} strokeWidth="2" />
      <rect x="74" y="30" width="10" height="14" fill={wall} stroke={ink} strokeWidth="2" />
      <rect x="88" y="30" width="10" height="14" fill={wall} stroke={ink} strokeWidth="2" />
      <rect x="102" y="30" width="10" height="14" fill={wall} stroke={ink} strokeWidth="2" />
      <rect x="116" y="30" width="10" height="14" fill={wall} stroke={ink} strokeWidth="2" />
      {/* janelas centrais */}
      <rect x="72" y="55" width="14" height="18" fill={gate} stroke={ink} strokeWidth="2" />
      <rect x="114" y="55" width="14" height="18" fill={gate} stroke={ink} strokeWidth="2" />

      {/* ── Porta (arco) ── */}
      <rect x="85" y="100" width="30" height="35" fill={gate} stroke={ink} strokeWidth="2" />
      <path d="M85,110 Q100,95 115,110" fill={gate} stroke={ink} strokeWidth="2" />

      {/* ── Ponte levadiça ── */}
      <g
        style={{
          transformOrigin: '100px 135px',
          transform: drawbridgeOpen ? 'scaleY(0.05)' : 'scaleY(1)',
          transition: 'transform 300ms ease-in',
        }}
      >
        <rect x="85" y="130" width="30" height="10" fill={bridge} stroke={ink} strokeWidth="2" />
        {/* correntes */}
        <line x1="88" y1="130" x2="86" y2="110" stroke={ink} strokeWidth="1.5" />
        <line x1="112" y1="130" x2="114" y2="110" stroke={ink} strokeWidth="1.5" />
      </g>
    </svg>
  );
}
