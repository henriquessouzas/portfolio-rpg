import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Compass, Heart, Map, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/rpg/ui/button';
import { findPath, rooms, type Artifact, type Book, type Point, type Room, type RoomId } from '@/lib/portfolio-data';
import { MAP_ENTRANCE, MAP_HEIGHT, MAP_WIDTH, moveBy, planRoute, ROOM_BOUNDS, ROOM_STAND, roomAt, sampleRoute, type PlanRoomId } from '@/lib/castle-plan';
import { Crest, Hero, ObjectArt } from './art';
import { WindScene } from './wind-scene';
import { RoomScene } from './room-scene';
import { CastleMap } from './map/castle-map';
import { ShelfView } from './shelf-view';
import { roomEntrance, roomGrid, roomLayouts } from '@/lib/room-layouts';

type Screen = 'castle' | 'map' | 'room' | 'simple';
const pause = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
const mapPoint = (point: Point) => ({ left: `${point.x / MAP_WIDTH * 100}%`, top: `${point.y / MAP_HEIGHT * 100}%` });
const roomBox = (id: RoomId) => { const [x, y, w, h] = ROOM_BOUNDS[id]; return { left: `${x / MAP_WIDTH * 100}%`, top: `${y / MAP_HEIGHT * 100}%`, width: `${w / MAP_WIDTH * 100}%`, height: `${h / MAP_HEIGHT * 100}%` }; };
const planNames: Record<PlanRoomId, string> = { ...Object.fromEntries(rooms.map(r => [r.id, r.name])) as Record<RoomId, string>, H: 'Entrada' };

export default function Portfolio() {
  const [screen, setScreen] = useState<Screen>('castle');
  const [room, setRoom] = useState<Room>(rooms[0]);
  const [position, setPosition] = useState<Point>(MAP_ENTRANCE);
  const [roomPosition, setRoomPosition] = useState<Point>(roomEntrance);
  const [selected, setSelected] = useState<Artifact | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [busy, setBusy] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [visited, setVisited] = useState<string[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [mapPath, setMapPath] = useState<Point[]>([]);
  const [mapTarget, setMapTarget] = useState<string | null>(null);
  const [focusRoom, setFocusRoom] = useState<RoomId | null>(null);
  const operation = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update(); query.addEventListener('change', update);
    return () => { query.removeEventListener('change', update); operation.current++; };
  }, []);
  useEffect(() => { if (screen !== 'castle') heading.current?.focus(); }, [screen]);

  function changeScreen(next: Screen) {
    operation.current++; setBook(null); setBusy(false); setTransitioning(false); setMapPath([]); setMapTarget(null); setScreen(next);
  }
  async function enterCastle() {
    if (busy) return;
    const token = ++operation.current; setBusy(true); setTransitioning(true);
    if (!reducedMotion) await pause(750);
    if (token !== operation.current) return;
    setPosition(MAP_ENTRANCE); setScreen('map'); setTransitioning(false); setBusy(false);
  }
  async function pickObject(artifact: Artifact, index: number, currentRoom = room) {
    const token = ++operation.current;
    const fixture = roomLayouts[currentRoom.id].find(f => f.object === index);
    if (!fixture?.approach) return;
    const start = screen === 'room' && currentRoom.id === room.id ? roomPosition : roomEntrance;
    const path = findPath(start, fixture.approach, roomGrid(currentRoom.id));
    if (!path.length) { setAnnouncement('Não há caminho até esse objeto.'); return; }
    setBusy(true); setSelected(null); setBook(null);
    for (const tile of reducedMotion ? [fixture.approach] : path.slice(1)) {
      if (!reducedMotion) await pause(100);
      if (token !== operation.current) return;
      setRoomPosition(tile);
    }
    if (!reducedMotion) await pause(140);
    if (token !== operation.current) return;
    setSelected(artifact); setBusy(false); setAnnouncement(artifact.title);
  }
  async function goToRoom(destination: Room) {
    const route = planRoute(position, ROOM_STAND[destination.id]);
    if (!route.length) { setAnnouncement('Não há caminho até essa sala.'); return; }
    const steps = sampleRoute(route, 22);
    const token = ++operation.current; setBusy(true); setTransitioning(false); setMapTarget(destination.id); setMapPath(steps); setAnnouncement(`A caminho: ${destination.name}`);
    for (const point of reducedMotion ? steps.slice(-1) : steps) {
      if (!reducedMotion) await pause(80);
      if (token !== operation.current) return;
      setPosition(point);
      setMapPath(prev => prev.slice(1));
    }
    setTransitioning(true);
    if (!reducedMotion) await pause(350);
    if (token !== operation.current) return;
    setRoom(destination); setSelected(null); setBook(null); setRoomPosition(roomEntrance); setScreen('room'); setTransitioning(false); setBusy(false); setMapPath([]); setMapTarget(null);
    setVisited(prev => prev.includes(destination.id) ? prev : [...prev, destination.id]);
    setAnnouncement(destination.name);
    if (destination.id === 'T') void pickObject(destination.objects[0], 0, destination);
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { if (screen === 'room') changeScreen('map'); else if (screen === 'map') changeScreen('castle'); return; }
      if (screen !== 'map' || busy || (event.target instanceof HTMLElement && event.target.closest('a, input, textarea, select'))) return;
      const direction: Record<string, Point> = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
      const delta = direction[event.key];
      if (delta) { event.preventDefault(); setPosition(moveBy(position, delta.x * 10, delta.y * 10)); }
      if (event.key === 'Enter' && !(event.target instanceof HTMLElement && event.target.closest('button'))) { const here = roomAt(position); const target = rooms.find(r => r.id === here); if (target) void goToRoom(target); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return <div className="portfolio-shell">
    <header className="site-header">
      <a href="/" className="brand" aria-label="Henrique Santos de Souza — início"><Crest/><span>HENRIQUE<span className="brand-sub">PORTFÓLIO • RPG</span></span></a>
      <div className="header-actions"><span className="availability"><span/>Aberto a novas aventuras</span><Button variant="parchment" onClick={() => changeScreen(screen === 'simple' ? 'castle' : 'simple')}>{screen === 'simple' ? <><Compass/>Voltar ao jogo</> : <>Pular o jogo<ArrowRight/></>}</Button></div>
    </header>

    <main>
      {screen === 'castle' && <section className="castle-screen">
        <div className="intro"><span className="eyebrow"><span/> UM PORTFÓLIO, UMA AVENTURA <span/></span><h1>Henrique Santos<br/><span>de Souza</span></h1><p>Código, criatividade e um mundo para descobrir.</p></div>
        <div className="castle-world">
          <Button variant="scene" onClick={() => void enterCastle()} aria-label="Entrar no castelo" disabled={busy} className={transitioning ? 'castle-entering' : ''}>
            <WindScene reducedMotion={reducedMotion}/>
            <span className="scene-vignette"/>
            <span className="world-label"><span className="live-dot"/> REINO DE HENRIQUE</span>
            <span className="castle-cta pixel-button pixel-primary">{busy ? 'Abrindo os portões...' : 'Entrar no castelo'}{!busy && <ArrowRight size={18}/>}</span>
            <span className="castle-coordinate">EST. 2026 <span>✦</span> UMA NOVA JORNADA</span>
          </Button>
          <div className="corner corner-tl"/><div className="corner corner-tr"/><div className="corner corner-bl"/><div className="corner corner-br"/>
        </div>
        <div className="world-caption"><span><Compass size={16}/> Cinco salas. Muitas histórias.</span><span>DESENVOLVEDOR & EXPLORADOR</span></div>
        <section className="room-directory" aria-label="As cinco salas do castelo">{rooms.map((r, i) => <div className={`directory-item room-${r.id}`} key={r.id}><ObjectArt kind={r.objects[0].art}/><div><span className="directory-number">0{i + 1} / {r.category}</span><h2>{r.name}</h2></div></div>)}</section>
      </section>}

      {(screen === 'map' || screen === 'room') && <section className="adventure-screen">
        <div className="game-heading"><div><span className="eyebrow">A JORNADA CONTINUA</span><h1 ref={heading} tabIndex={-1}>{screen === 'map' ? 'Dentro do castelo' : room.name}</h1><p>{screen === 'map' ? 'Um reino de ideias, conquistas e possibilidades.' : room.subtitle}</p></div><Button variant="parchment" onClick={() => changeScreen(screen === 'room' ? 'map' : 'castle')}><ArrowLeft/>{screen === 'room' ? 'Voltar ao mapa' : 'Sair do castelo'}</Button></div>
        <div className="game-hud"><span><Map size={16}/> CASTELO <ChevronRight size={14}/>{screen === 'map' ? 'MAPA' : room.name.toUpperCase()}</span><div className="hud-health"><Heart/><Heart/><Heart/><span>EXPLORADOR</span></div></div>
        {screen === 'map' ? <div className="map-layout"><div className={`map-world ${transitioning ? 'map-zoom' : ''}`}><CastleMap names={planNames} activeRoom={rooms.find(r => r.id === mapTarget)?.id ?? null} focusRoom={focusRoom} visited={visited} onSelectRoom={id => { const target = rooms.find(r => r.id === id); if (target && !busy) void goToRoom(target); }}/><svg className="map-route" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} aria-hidden="true">{mapPath.filter((_, i) => i % 2 === 0).map(p => <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r="2.6" className="fill-gold stroke-ink" strokeWidth="1"/>)}</svg>{rooms.map(r => <button type="button" key={r.id} aria-label={r.name} aria-pressed={mapTarget === r.id} className="map-room-hit" style={roomBox(r.id)} onFocus={() => setFocusRoom(r.id)} onBlur={() => setFocusRoom(null)} onClick={() => void goToRoom(r)}><span className="sr-only">{r.name}</span></button>)}<div className="map-hero" style={mapPoint(position)}><Hero walking={busy && !transitioning}/></div></div>
          <aside className="exploration-log"><span className="eyebrow"><Compass size={15}/> SEU MAPA</span><h2>Diário de<br/>exploração</h2><div className="exploration-progress"><span>Salas descobertas</span><strong>{visited.length}<span> / 5</span></strong><progress max="5" value={visited.length} aria-label="Salas descobertas"/></div><ul>{rooms.map(r => <li key={r.id} className={visited.includes(r.id) ? 'discovered' : ''}><span className="log-mark">{visited.includes(r.id) ? <Check size={12}/> : '◇'}</span><div><strong>{r.name}</strong><span>{r.category}</span></div></li>)}</ul><div className="journal-end"><Sparkles size={17}/><span>{visited.length === 5 ? 'Todos os caminhos foram descobertos.' : 'Cada sala guarda uma parte da jornada.'}</span></div></aside>
        </div> : <><RoomScene room={room} position={roomPosition} selected={selected} walking={busy} onPick={(obj,i) => void pickObject(obj,i)}/>
          {selected?.books ? <ShelfView artifact={selected} book={book} onBook={setBook} onClose={() => { setSelected(null); setBook(null); }}/> : <div className={`dialogue-panel room-${room.id}`} aria-live="polite"><div className="dialogue-portrait"><ObjectArt kind={selected?.art ?? room.objects[0].art}/></div><div className="dialogue-content"><span className="eyebrow">{selected ? `${room.name} / ${selected.name}` : room.category}</span><h2>{selected?.title ?? room.name}</h2><p>{selected?.description ?? room.subtitle}</p>{selected && <div className="tags">{selected.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}</div>{selected && <Button variant="ghost" size="icon" aria-label="Fechar detalhes" onClick={() => setSelected(null)}><X/></Button>}</div>}
        </>}
        <div className="game-bottom"><span><Hero/> HENRIQUE <span className="status-dot"/>{busy ? 'Explorando...' : 'Pronto para a próxima aventura'}</span><span>{screen === 'map' ? '01 / O CASTELO' : `02 / ${room.name.toUpperCase()}`}</span></div>
      </section>}

      {screen === 'simple' && <section className="simple-screen"><div className="game-heading"><div><span className="eyebrow">A MESMA HISTÓRIA, OUTRO CAMINHO</span><h1 ref={heading} tabIndex={-1}>Henrique Santos de Souza</h1><p>Código, criatividade e um mundo para descobrir.</p></div><Crest/></div><nav className="simple-nav" aria-label="Seções do portfólio">{rooms.map(r => <a key={r.id} href={`#simple-${r.id}`}>{r.name}<ChevronRight size={14}/></a>)}</nav>{[rooms[1], rooms[3], rooms[4], rooms[0], rooms[2]].map(r => <section className={`simple-section room-${r.id}`} id={`simple-${r.id}`} key={r.id}><div className="simple-section-heading"><ObjectArt kind={r.objects[0].art}/><div><span className="eyebrow">{r.category}</span><h2>{r.name}</h2></div></div><div className="simple-objects">{r.objects.map(obj => <article key={obj.name}><h3>{obj.title}</h3><p>{obj.description}</p><div className="tags">{obj.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{obj.books && <ul className="simple-books">{obj.books.map(b => <li key={b.title}><strong>{b.title}</strong>: {b.description}</li>)}</ul>}</article>)}</div></section>)}</section>}
    </main>
    <footer className="site-footer"><span><Crest/> FEITO DE CÓDIGO & CURIOSIDADE</span><span>HENRIQUE SANTOS DE SOUZA <span>© 2026</span></span></footer>
    <span className="sr-only" role="status">{announcement}</span>
  </div>;
}