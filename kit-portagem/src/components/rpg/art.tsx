export function Hero({ walking = false }: { walking?: boolean }) {
  return <svg viewBox="0 0 24 32" className={`hero-sprite ${walking ? 'walking' : ''}`} aria-hidden="true" shapeRendering="crispEdges">
    <ellipse cx="12" cy="30" rx="9" ry="2" className="sprite-shadow"/>
    <path d="M6 16h12v11H6zM4 18h3v9H4zM18 18h3v9h-3z" className="fill-ember"/>
    <path d="M7 7h11v11H7z" className="fill-skin"/>
    <path d="M5 5h14v5H5zM7 2h10v3H7zM4 8h3v5H4zM17 8h3v5h-3z" className="fill-ink"/>
    <path d="M7 18h10v8H7zM6 17h12v3H6z" className="fill-gold"/>
    <path d="M8 26h4v5H7v-3h1zM14 26h4v5h-5v-3h1z" className="fill-ink legs"/>
    <path d="M9 11h2v2H9zM15 11h2v2h-2z" className="fill-ink"/>
    <path d="M5 20h3v5H5zM18 20h3v5h-3z" className="fill-skin"/>
    <path d="M18 15h2v12h-2z" className="fill-steel"/>
    <path d="M16 24h6v2h-6z" className="fill-gold"/>
  </svg>;
}

export function ObjectArt({ kind, className = '' }: { kind: string; className?: string }) {
  const art: Record<string, React.ReactNode> = {
    sword: <><path d="M28 5h8v36l-4 6-4-6z" className="fill-steel"/><path d="M32 8v32" className="stroke-surface"/><path d="M20 41h24v5H20zM29 46h6v13h-6z" className="fill-gold"/><path d="M27 57h10v5H27z" className="fill-ink"/></>,
    shield: <><path d="M9 12l23-7 23 7v23c0 13-23 26-23 26S9 48 9 35z" className="fill-gold"/><path d="M15 17l17-5 17 5v18c0 9-17 19-17 19S15 44 15 35z" className="fill-mana"/><path d="M29 19h6v25h-6zM21 27h22v6H21z" className="fill-surface"/></>,
    bow: <><path d="M18 6q40 26 0 53" className="stroke-wood"/><path d="M18 6v53M9 33h43" className="stroke-gold"/><path d="M45 27l9 6-9 6" className="stroke-steel"/></>,
    anvil: <><path d="M8 15h46v10L41 31H22L8 25zM26 31h12v12H26zM20 43h25l7 11H13z" className="fill-steel"/><path d="M7 15h48v6H7z" className="fill-surface"/><path d="M9 55h45v6H9z" className="fill-wood"/></>,
    book: <><path d="M8 11q12-5 24 2 12-7 24-2v41q-12-4-24 3-12-7-24-3z" className="fill-surface"/><path d="M8 11v41q12-4 24 3 12-7 24-3V11M32 13v42" className="stroke-wood"/><path d="M14 22h12m-12 8h12m-12 8h12m12-16h12m-12 8h12m-12 8h12" className="stroke-gold"/></>,
    books: <><path d="M9 10h11v44H9z" className="fill-ember"/><path d="M23 7h12v47H23z" className="fill-mana"/><path d="M38 12l10-3 12 42-10 3z" className="fill-forest"/><path d="M9 18h11m3-3h12M9 44h11m3 2h12m7-24 10-3" className="stroke-gold"/></>,
    scroll: <><path d="M16 10h35v42H18z" className="fill-surface"/><path d="M13 9h40v7H13zM13 49h40v7H13z" className="fill-wood"/><path d="M23 24h20m-20 7h20m-20 7h12" className="stroke-gold"/><circle cx="40" cy="44" r="7" className="fill-ember"/></>,
    throne: <><path d="M14 10h36v43H14zM9 37h9v24H9zM46 37h9v24h-9z" className="fill-gold"/><path d="M20 15h24v32H20z" className="fill-ember"/><path d="M18 47h29v9H18z" className="fill-royal"/><path d="M22 10l-4-8 9 5 5-7 5 7 9-5-4 8z" className="fill-gold"/><path d="M11 59h42" className="stroke-wood"/></>,
    trophy: <><path d="M18 8h28v18c0 11-28 11-28 0zM28 36h8v13h-8zM20 49h24v7H20z" className="fill-gold"/><path d="M18 14H9v9q0 11 15 11m22-20h9v9q0 11-15 11" className="stroke-gold"/><path d="M17 56h30v5H17z" className="fill-wood"/><path d="M26 13h6v13h-6z" className="fill-surface"/></>,
    letter: <><path d="M7 19h50v33H7z" className="fill-surface"/><path d="M7 19l25 19 25-19M7 52l18-17m32 17L39 35" className="stroke-gold"/><circle cx="32" cy="36" r="6" className="fill-ember"/></>,
    bed: <><path d="M6 13h8v45H6zM51 33h7v25h-7z" className="fill-wood"/><path d="M14 28h37v23H14z" className="fill-royal"/><path d="M14 24h15v13H14z" className="fill-surface"/><path d="M9 49h47v7H9z" className="fill-wood"/></>,
    desk: <><path d="M6 37h52v6H6zM10 43h6v18h-6zM48 43h6v18h-6z" className="fill-wood"/><path d="M17 9h31v23H17zM28 32h8v5h-8z" className="fill-ink"/><path d="M21 13h23v15H21z" className="fill-mana"/><path d="M25 17l-3 3 3 3m15-6 3 3-3 3" className="stroke-surface"/></>,
    poster: <><path d="M12 4h40v54H12z" className="fill-gold"/><path d="M16 8h32v46H16z" className="fill-mana"/><circle cx="39" cy="18" r="5" className="fill-surface"/><path d="M16 47l12-22 9 15 4-6 7 13z" className="fill-forest"/></>,
    chest: <><path d="M9 29q0-20 23-20t23 20v26H9z" className="fill-wood"/><path d="M9 29h46v5H9zM16 13v42m32-42v42" className="stroke-gold"/><path d="M28 28h8v13h-8z" className="fill-gold"/><path d="M31 33h2v4h-2z" className="fill-ink"/></>,
    potion: <><path d="M24 5h16v6H24z" className="fill-wood"/><path d="M26 11h12v14q16 8 16 20c0 17-44 17-44 0q0-12 16-20z" className="fill-steel"/><path d="M14 39q18-5 36 0v8c0 12-36 12-36 0z" className="fill-mana"/><path d="M20 29l-5 9m5 5v6" className="stroke-surface"/></>,
    flask: <><path d="M22 7h20v5H22z" className="fill-wood"/><path d="M26 12h12v14l17 26q3 7-7 7H16q-10 0-7-7l17-26z" className="fill-steel"/><path d="M19 38h26l9 15H10z" className="fill-forest"/><circle cx="27" cy="46" r="3" className="fill-surface"/><circle cx="39" cy="50" r="2" className="fill-surface"/></>,
    cauldron: <><path d="M8 24h48v13q0 19-24 19T8 37z" className="fill-ink"/><ellipse cx="32" cy="24" rx="24" ry="7" className="fill-forest"/><path d="M12 55l-3 7m43-7 3 7" className="stroke-wood"/><circle cx="25" cy="12" r="4" className="fill-forest"/><circle cx="40" cy="5" r="3" className="fill-forest"/><path d="M17 34v8" className="stroke-steel"/></>,
  };
  return <svg viewBox="0 0 64 64" className={`object-art ${className}`} aria-hidden="true" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">{art[kind] ?? art['book']}</svg>;
}

export function Crest() {
  return <svg viewBox="0 0 40 44" aria-hidden="true" className="crest"><path d="M4 5h32v22L20 40 4 27z" className="fill-gold stroke-ink" strokeWidth="3"/><path d="M11 14h18v14H11zM10 10h5v8h-5zM18 10h5v8h-5zM26 10h5v8h-5z" className="fill-ink"/><path d="M17 22h6v7h-6z" className="fill-gold"/></svg>;
}