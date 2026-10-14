import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Compass,
  Heart,
  Map,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/rpg/ui/button';
import {
  findPath,
  profile,
  rooms,
  type Artifact,
  type Book,
  type Point,
  type Room,
  type RoomId,
} from '@/lib/portfolio-data';
import {
  MAP_ENTRANCE,
  MAP_HEIGHT,
  MAP_WIDTH,
  moveBy,
  planRoute,
  ROOM_BOUNDS,
  ROOM_STAND,
  roomAt,
  sampleRoute,
  type PlanRoomId,
} from '@/lib/castle-plan';
import { Crest, Hero, ObjectArt } from './art';
import { WindScene } from './wind-scene';
import { RoomScene } from './room-scene';
import { CastleMap } from './map/castle-map';
import { ShelfView } from './shelf-view';
import { ThemeToggle } from './theme-toggle';
import { LangToggle } from './lang-toggle';
import { LangProvider, useLang } from '@/hooks/use-lang';
import { Hud } from './hud';
import { ExplorerAchievement, hasSeenAchievement, markAchievementSeen } from './explorer-achievement';
import { TypewriterDescription } from './typewriter-description';
import { Popup } from './popup';
import { Messenger } from './messenger';
import { TechSearch } from './arsenal/tech-search';
import { roomEntrance, roomGrid, roomLayouts } from '@/lib/room-layouts';
import { useGithubBooks } from '@/hooks/use-github-books';
import { parseHash, formatHash } from '@/lib/deep-link';

const LazyTechSphere = lazy(() => import('./tech-sphere/tech-sphere'));

type Screen = 'castle' | 'map' | 'room' | 'simple';
const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const mapPoint = (point: Point) => ({
  left: `${(point.x / MAP_WIDTH) * 100}%`,
  top: `${(point.y / MAP_HEIGHT) * 100}%`,
});
const roomBox = (id: RoomId) => {
  const [x, y, w, h] = ROOM_BOUNDS[id];
  return {
    left: `${(x / MAP_WIDTH) * 100}%`,
    top: `${(y / MAP_HEIGHT) * 100}%`,
    width: `${(w / MAP_WIDTH) * 100}%`,
    height: `${(h / MAP_HEIGHT) * 100}%`,
  };
};
const planNames: Record<PlanRoomId, string> = {
  ...(Object.fromEntries(rooms.map((r) => [r.id, r.name])) as Record<RoomId, string>),
  H: 'Entrada',
};

export default function Portfolio() {
  return (
    <LangProvider>
      <PortfolioInner />
    </LangProvider>
  );
}

function PortfolioInner() {
  const { t } = useLang();

  // ── deep-link: resolve initial screen/room from hash ──────────────────────
  const initialTarget = parseHash(window.location.hash);
  const initialRoom =
    initialTarget?.kind === 'room'
      ? (rooms.find((r) => r.id === initialTarget.id) ?? rooms[0])
      : rooms[0];
  const initialScreen: Screen =
    initialTarget?.kind === 'room'
      ? 'room'
      : initialTarget?.kind === 'simple'
        ? 'simple'
        : 'castle';

  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [room, setRoom] = useState<Room>(initialRoom);
  const [visited, setVisited] = useState<string[]>(
    initialTarget?.kind === 'room' ? [initialTarget.id] : [],
  );
  const [position, setPosition] = useState<Point>(MAP_ENTRANCE);
  const [roomPosition, setRoomPosition] = useState<Point>(roomEntrance);
  const [selected, setSelected] = useState<Artifact | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [popupAnchor, setPopupAnchor] = useState<{ x: number; y: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [mapPath, setMapPath] = useState<Point[]>([]);
  const [mapTarget, setMapTarget] = useState<string | null>(null);
  const [focusRoom, setFocusRoom] = useState<RoomId | null>(null);
  const [showAchievement, setShowAchievement] = useState(false);
  const operation = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const { books: githubBooks, status: githubBooksStatus, user: githubUser } = useGithubBooks();

  useEffect(() => {
    if (visited.length === 5 && !hasSeenAchievement()) {
      markAchievementSeen();
      setShowAchievement(true);
    }
  }, [visited.length]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => {
      query.removeEventListener('change', update);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      operation.current++;
    };
  }, []);
  useEffect(() => {
    if (screen !== 'castle') heading.current?.focus();
  }, [screen]);

  function closePopup() {
    setSelected(null);
    setSelectedTech(null);
    setBook(null);
    setPopupAnchor(null);
  }

  function changeScreen(next: Screen) {
    operation.current++;
    setBook(null);
    setSelected(null);
    setPopupAnchor(null);
    setBusy(false);
    setTransitioning(false);
    setMapPath([]);
    setMapTarget(null);
    setScreen(next);
    const hash =
      next === 'simple' ? formatHash({ kind: 'simple' }) : '';
    history.replaceState(null, '', window.location.pathname + hash);
  }
  async function enterCastle() {
    if (busy) return;
    const token = ++operation.current;
    setBusy(true);
    setTransitioning(true);
    if (!reducedMotion) await pause(750);
    if (token !== operation.current) return;
    setPosition(MAP_ENTRANCE);
    setScreen('map');
    setTransitioning(false);
    setBusy(false);
  }
  async function pickObject(
    artifact: Artifact,
    index: number,
    currentRoom = room,
    anchor: { x: number; y: number } | null = null,
  ) {
    const token = ++operation.current;
    const fixture = roomLayouts[currentRoom.id].find((f) => f.object === index);
    if (!fixture?.approach) return;
    const start = screen === 'room' && currentRoom.id === room.id ? roomPosition : roomEntrance;
    const path = findPath(start, fixture.approach, roomGrid(currentRoom.id));
    if (!path.length) {
      setAnnouncement(t.noPathToObject);
      return;
    }
    setBusy(true);
    setSelected(null);
    setSelectedTech(null);
    setBook(null);
    setPopupAnchor(null);
    for (const tile of reducedMotion ? [fixture.approach] : path.slice(1)) {
      if (!reducedMotion) await pause(100);
      if (token !== operation.current) return;
      setRoomPosition(tile);
    }
    if (!reducedMotion) await pause(140);
    if (token !== operation.current) return;
    setSelected(artifact);
    setSelectedTech(
      artifact.name === 'Esfera das tecnologias' ? profile.technologies[0]?.name ?? null : null,
    );
    setPopupAnchor(anchor);
    setBusy(false);
    setAnnouncement(artifact.title);
  }
  async function goToRoom(destination: Room) {
    const route = planRoute(position, ROOM_STAND[destination.id]);
    if (!route.length) {
      setAnnouncement(t.noPathToRoom);
      return;
    }
    const steps = sampleRoute(route, 22);
    const token = ++operation.current;
    setBusy(true);
    setTransitioning(false);
    setMapTarget(destination.id);
    setMapPath(steps);
    setAnnouncement(t.headingTo(destination.name));
    for (const point of reducedMotion ? steps.slice(-1) : steps) {
      if (!reducedMotion) await pause(80);
      if (token !== operation.current) return;
      setPosition(point);
      setMapPath((prev) => prev.slice(1));
    }
    setTransitioning(true);
    if (!reducedMotion) await pause(350);
    if (token !== operation.current) return;
    setRoom(destination);
    setSelected(null);
    setBook(null);
    setPopupAnchor(null);
    setRoomPosition(roomEntrance);
    setScreen('room');
    setTransitioning(false);
    setBusy(false);
    setMapPath([]);
    setMapTarget(null);
    setVisited((prev) => (prev.includes(destination.id) ? prev : [...prev, destination.id]));
    setAnnouncement(destination.name);
    history.replaceState(null, '', window.location.pathname + formatHash({ kind: 'room', id: destination.id }));
    if (destination.id === 'T') void pickObject(destination.objects[0], 0, destination);
  }

  const techItems = profile.technologies.map((tech) => ({
    name: tech.name,
    category: tech.category,
    level: tech.years ?? 1,
  }));

  const activeTech =
    selected?.name === 'Esfera das tecnologias'
      ? profile.technologies.find((tech) => tech.name === selectedTech) ?? profile.technologies[0] ?? null
      : null;

  const matchingGithubRepos = activeTech
    ? githubBooks.filter((book) => {
        const normalizedTitle = (book.subtitle ?? '').trim().toLocaleLowerCase();
        const normalizedTech = activeTech.name.trim().toLocaleLowerCase();
        return normalizedTitle === normalizedTech || normalizedTitle.includes(normalizedTech) || normalizedTech.includes(normalizedTitle);
      })
    : [];

  // hashchange: navigate when user edits the URL bar or uses back/forward
  useEffect(() => {
    function onHashChange() {
      const target = parseHash(window.location.hash);
      if (!target) return;
      if (target.kind === 'castle') { changeScreen('castle'); return; }
      if (target.kind === 'simple') { changeScreen('simple'); return; }
      const dest = rooms.find((r) => r.id === target.id);
      if (!dest) return;
      operation.current++;
      setRoom(dest);
      setRoomPosition(roomEntrance);
      setSelected(null);
      setBook(null);
      setPopupAnchor(null);
      setBusy(false);
      setTransitioning(false);
      setMapPath([]);
      setMapTarget(null);
      setScreen('room');
      setVisited((prev) => (prev.includes(dest.id) ? prev : [...prev, dest.id]));
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
      if (event.key === 'Escape') {
        if (selected) {
          event.preventDefault();
          event.stopPropagation();
          closePopup();
          return;
        }
        if (screen === 'room') changeScreen('map');
        else if (screen === 'map') changeScreen('castle');
        return;
      }
      if (
        screen !== 'map' ||
        busy ||
        (event.target instanceof HTMLElement && event.target.closest('a, input, textarea, select'))
      )
        return;
      const direction: Record<string, Point> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      };
      const delta = direction[event.key];
      if (delta) {
        event.preventDefault();
        setPosition(moveBy(position, delta.x * 10, delta.y * 10));
      }
      if (
        event.key === 'Enter' &&
        !(event.target instanceof HTMLElement && event.target.closest('button'))
      ) {
        const here = roomAt(position);
        const target = rooms.find((r) => r.id === here);
        if (target) void goToRoom(target);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="portfolio-shell">
      <header className="site-header">
        <a href="/" className="brand" aria-label="Henrique Santos de Souza — início">
          <Crest />
          <span>
            HENRIQUE<span className="brand-sub">{t.brandSub}</span>
          </span>
        </a>
        <div className="header-actions">
          <LangToggle />
          <ThemeToggle />
          <span className="availability">
            <span />
            {t.openToAdventures}
          </span>
          <Button
            variant="parchment"
            onClick={() => changeScreen(screen === 'simple' ? 'castle' : 'simple')}
          >
            {screen === 'simple' ? (
              <>
                <Compass />
                {t.backToGame}
              </>
            ) : (
              <>
                {t.skipGame}
                <ArrowRight />
              </>
            )}
          </Button>
        </div>
      </header>

      <main>
        {screen === 'castle' && (
          <section className="castle-screen">
            <div className="intro">
              <span className="eyebrow">
                <span /> {t.eyebrowCastle} <span />
              </span>
              <h1>
                Henrique Santos
                <br />
                <span>de Souza</span>
              </h1>
              <p>{t.heroSubtitle}</p>
            </div>
            <div className="castle-world">
              <Button
                variant="scene"
                onClick={() => void enterCastle()}
                aria-label={t.enterCastle}
                disabled={busy}
                className={transitioning ? 'castle-entering' : ''}
              >
                <WindScene reducedMotion={reducedMotion} />
                <span className="scene-vignette" />
                <span className="world-label">
                  <span className="live-dot" /> {t.worldLabel}
                </span>
                <span className="castle-cta pixel-button pixel-primary">
                  {busy ? t.openingGates : t.enterCastle}
                  {!busy && <ArrowRight size={18} />}
                </span>
                <span className="castle-coordinate">
                  {t.castleCoordinate}
                </span>
              </Button>
              <div className="corner corner-tl" />
              <div className="corner corner-tr" />
              <div className="corner corner-bl" />
              <div className="corner corner-br" />
            </div>
            <div className="world-caption">
              <span>
                <Compass size={16} /> {t.fiveRooms}
              </span>
              <span>{t.devExplorer}</span>
            </div>
            <section className="room-directory" aria-label="As cinco salas do castelo">
              {rooms.map((r, i) => (
                <div className={`directory-item room-${r.id}`} key={r.id}>
                  <ObjectArt kind={r.objects[0].art} />
                  <div>
                    <span className="directory-number">
                      0{i + 1} / {r.category}
                    </span>
                    <h2>{r.name}</h2>
                  </div>
                </div>
              ))}
            </section>
          </section>
        )}

        {(screen === 'map' || screen === 'room') && (
          <section className="adventure-screen">
            <Hud visited={visited.length} />
            <div className="game-heading">
              <div>
                <span className="eyebrow">{t.eyebrowJourney}</span>
                <h1 ref={heading} tabIndex={-1}>
                  {screen === 'map' ? t.insideCastle : room.name}
                </h1>
                <p>
                  {screen === 'map' ? t.castleDesc : room.subtitle}
                </p>
              </div>
              <Button
                variant="parchment"
                onClick={() => changeScreen(screen === 'room' ? 'map' : 'castle')}
              >
                <ArrowLeft />
                {screen === 'room' ? t.backToMap : t.leaveCastle}
              </Button>
            </div>
            <div className="game-hud">
              <span>
                <Map size={16} /> {t.castle} <ChevronRight size={14} />
                {screen === 'map' ? t.map : room.name.toUpperCase()}
              </span>
              <div className="hud-health">
                <Heart />
                <Heart />
                <Heart />
                <span>{t.explorer}</span>
              </div>
            </div>
            {screen === 'map' ? (
              <div className="map-layout">
                <div className={`map-world ${transitioning ? 'map-zoom' : ''}`}>
                  <CastleMap
                    names={planNames}
                    activeRoom={rooms.find((r) => r.id === mapTarget)?.id ?? null}
                    focusRoom={focusRoom}
                    visited={visited}
                    onSelectRoom={(id) => {
                      const target = rooms.find((r) => r.id === id);
                      if (target && !busy) void goToRoom(target);
                    }}
                  />
                  <svg
                    className="map-route"
                    viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                    aria-hidden="true"
                  >
                    {mapPath
                      .filter((_, i) => i % 2 === 0)
                      .map((p) => (
                        <circle
                          key={`${p.x}-${p.y}`}
                          cx={p.x}
                          cy={p.y}
                          r="2.6"
                          className="fill-gold stroke-ink"
                          strokeWidth="1"
                        />
                      ))}
                  </svg>
                  {rooms.map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      aria-label={r.name}
                      aria-pressed={mapTarget === r.id}
                      className="map-room-hit"
                      style={roomBox(r.id)}
                      onFocus={() => setFocusRoom(r.id)}
                      onBlur={() => setFocusRoom(null)}
                      onClick={() => void goToRoom(r)}
                    >
                      <span className="sr-only">{r.name}</span>
                    </button>
                  ))}
                  <div className="map-hero" style={mapPoint(position)}>
                    <Hero walking={busy && !transitioning} />
                  </div>
                </div>
                <aside className="exploration-log">
                  <span className="eyebrow">
                    <Compass size={15} /> {t.yourMap}
                  </span>
                  <h2>
                    {t.explorationDiary.split('\n').map((line, i) => (
                      <span key={i}>{line}{i === 0 && <br />}</span>
                    ))}
                  </h2>
                  <div className="exploration-progress">
                    <span>{t.roomsDiscovered}</span>
                    <strong>
                      {visited.length}
                      <span> / 5</span>
                    </strong>
                    <div
                      className="exploration-progressbar"
                      role="progressbar"
                      aria-label="Progresso da exploração"
                      aria-valuemin={0}
                      aria-valuemax={5}
                      aria-valuenow={visited.length}
                    >
                      <span style={{ width: `${(visited.length / 5) * 100}%` }} />
                    </div>
                  </div>
                  <ul>
                    {rooms.map((r) => (
                      <li key={r.id} className={visited.includes(r.id) ? 'discovered' : ''}>
                        <span className="log-mark">
                          {visited.includes(r.id) ? <Check size={12} /> : '◇'}
                        </span>
                        <div>
                          <strong>{r.name}</strong>
                          <span>{r.category}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="journal-end">
                    <Sparkles size={17} />
                    <span>
                      {visited.length === 5
                        ? t.allPathsFound
                        : t.eachRoomHolds}
                    </span>
                  </div>
                </aside>
              </div>
            ) : (
              <>
                <div
                  className="room-scene-zoom"
                  style={{
                    transition: reducedMotion ? 'none' : 'transform 450ms ease-in-out',
                    transform: selected?.name === 'Esfera das tecnologias' ? `scale(${reducedMotion ? 1 : 1.35})` : 'scale(1)',
                    transformOrigin: '50% 48%',
                  }}
                >
                  <RoomScene
                    room={room}
                    position={roomPosition}
                    selected={selected}
                    walking={busy}
                    onPick={(obj, i, anchor) => void pickObject(obj, i, room, anchor)}
                  />
                </div>
                {selected && (
                  <Popup
                    title={selected.name === 'Mensageiro' ? 'Mensageiro' : selected.books || selected.name === 'Projetos' ? `${t.shelfPrefix} ${selected.name}` : selected.title}
                    onClose={closePopup}
                    width={selected.name === 'Mensageiro' ? 480 : selected.name === 'Esfera das tecnologias' ? 720 : selected.books || selected.name === 'Projetos' ? 760 : 560}
                    initialAnchor={popupAnchor}
                    footer={
                      selected.name === 'Projetos' ? (
                        <span>
                          {t.autoUpdatedGitHub}{' '}
                          <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer">
                            {t.profile}
                          </a>
                        </span>
                      ) : undefined
                    }
                  >
                    {selected.name === 'Mensageiro' ? (
                      <Messenger profile={profile} />
                    ) : selected.books || selected.name === 'Projetos' ? (
                      <ShelfView
                        artifact={selected}
                        book={book}
                        onBook={setBook}
                        onClose={closePopup}
                        showClose={false}
                        books={selected.name === 'Projetos' ? githubBooks : selected.books ?? []}
                        status={selected.name === 'Projetos' ? githubBooksStatus : 'ready'}
                        githubUser={selected.name === 'Projetos' ? githubUser : undefined}
                      />
                    ) : selected.name === 'Pergaminho' ? (
                      <div className="popup-detail-content">
                        <span className="eyebrow">
                          {room.name} / {selected.name}
                        </span>
                        <h3>{selected.title}</h3>
                        <TypewriterDescription text={selected.description} reducedMotion={reducedMotion} />
                        <div className="tags">
                          {selected.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                        {(profile.cv.pt || profile.cv.en) && (
                          <div className="book-actions" style={{ marginTop: 16 }}>
                            {profile.cv.pt ? (
                              <a className="book-link" href={profile.cv.pt} target="_blank" rel="noopener noreferrer">
                                {t.openCvPt}
                              </a>
                            ) : null}
                            {profile.cv.en ? (
                              <a className="book-link" href={profile.cv.en} target="_blank" rel="noopener noreferrer">
                                {t.openCvEn}
                              </a>
                            ) : null}
                          </div>
                        )}
                      </div>
                    ) : selected.name === 'Esfera das tecnologias' ? (
                      <div className="tech-sphere-popup">
                        <div className="tech-sphere-column">
                          <Suspense fallback={<TechSearch items={techItems} selectedName={selectedTech ?? undefined} onClose={closePopup} />}>
                            <LazyTechSphere
                              items={techItems}
                              selectedName={selectedTech ?? undefined}
                              reducedMotion={reducedMotion}
                              onSelect={(name) => {
                                setSelectedTech(name);
                                setAnnouncement(t.techSelected(name));
                              }}
                            />
                          </Suspense>
                        </div>
                        <div className="tech-sphere-column tech-sphere-sidebar">
                          <TechSearch
                            items={techItems}
                            selectedName={selectedTech ?? undefined}
                            onSelect={(name) => {
                              setSelectedTech(name);
                              setAnnouncement(t.techSelected(name));
                            }}
                          />
                          {activeTech ? (
                            <div className="tech-sphere-detail">
                              <h3>{activeTech.name}</h3>
                              <dl>
                                <div>
                                  <dt>{t.level}</dt>
                                  <dd>{t.yearsUnit(Math.max(1, Math.round(activeTech.years ?? 1)))}</dd>
                                </div>
                                <div>
                                  <dt>{t.category}</dt>
                                  <dd>{activeTech.category}</dd>
                                </div>
                                <div>
                                  <dt>{t.years}</dt>
                                  <dd>{activeTech.years ?? 1}</dd>
                                </div>
                              </dl>
                              {matchingGithubRepos.length > 0 ? (
                                <div className="tech-sphere-repos">
                                  <h4>{t.repositories}</h4>
                                  <ul>
                                    {matchingGithubRepos.map((repo) => (
                                      <li key={repo.url ?? repo.title}>
                                        <a href={repo.url ?? '#'} target="_blank" rel="noreferrer noopener">
                                          {repo.title}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                <p className="tech-sphere-empty">{t.noRepos}</p>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : selected.categories ? (
                      <div className="popup-detail-content">
                        <span className="eyebrow">
                          {room.name} / {selected.name}
                        </span>
                        <h3>{selected.title}</h3>
                        <TypewriterDescription text={selected.description} reducedMotion={reducedMotion} />
                        <div className="tags" style={{ marginBottom: 16 }}>
                          {selected.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                        <ul className="tech-search-results">
                          {profile.technologies
                            .filter((t) => selected.categories!.includes(t.category))
                            .sort((a, b) => (b.years ?? 0) - (a.years ?? 0))
                            .map((tech) => {
                              const value = Math.min(100, Math.max(20, (tech.years ?? 1) * 22));
                              return (
                                <li key={tech.name} className="tech-search-item">
                                  <div className="tech-search-item-header">
                                    <strong>{tech.name}</strong>
                                    <span>{tech.category}</span>
                                  </div>
                                  <div
                                    className="tech-search-progress"
                                    role="progressbar"
                                    aria-label={`${tech.name}: ${value} de 100`}
                                    aria-valuenow={value}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                  >
                                    <span style={{ width: `${value}%` }} />
                                  </div>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    ) : (
                      <div className="popup-detail-content">
                        <span className="eyebrow">
                          {room.name} / {selected.name}
                        </span>
                        <h3>{selected.title}</h3>
                        <TypewriterDescription text={selected.description} reducedMotion={reducedMotion} />
                        <div className="tags">
                          {selected.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Popup>
                )}
              </>
            )}
            <div className="game-bottom">
              <span>
                <Hero /> HENRIQUE <span className="status-dot" />
                {busy ? t.exploring : t.readyNext}
              </span>
              <span>{screen === 'map' ? `01 / ${t.castle}` : `02 / ${room.name.toUpperCase()}`}</span>
            </div>
          </section>
        )}

        {screen === 'simple' && (
          <section className="simple-screen">
            <div className="game-heading">
              <div>
                <span className="eyebrow">{t.eyebrowSimple}</span>
                <h1 ref={heading} tabIndex={-1}>
                  Henrique Santos de Souza
                </h1>
                <p>{t.heroSubtitle}</p>
              </div>
              <Crest />
            </div>
            <nav className="simple-nav" aria-label={t.portfolioSections}>
              {rooms.map((r) => (
                <a key={r.id} href={`#simple-${r.id}`}>
                  {r.name}
                  <ChevronRight size={14} />
                </a>
              ))}
            </nav>
            {[rooms[1], rooms[3], rooms[4], rooms[0], rooms[2]].map((r) => (
              <section className={`simple-section room-${r.id}`} id={`simple-${r.id}`} key={r.id}>
                <div className="simple-section-heading">
                  <ObjectArt kind={r.objects[0].art} />
                  <div>
                    <span className="eyebrow">{r.category}</span>
                    <h2>{r.name}</h2>
                  </div>
                </div>
                <div className="simple-objects">
                  {r.objects.map((obj) => (
                    <article key={obj.name}>
                      <h3>{obj.title}</h3>
                      <p>{obj.description}</p>
                      <div className="tags">
                        {obj.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      {obj.books || obj.name === 'Projetos' ? (
                        <ul className="simple-books">
                          {(obj.name === 'Projetos' ? githubBooks : obj.books ?? []).map((b) => (
                            <li key={b.title}>
                              <a href={b.url ?? '#'} target={b.url ? '_blank' : undefined} rel={b.url ? 'noopener noreferrer' : undefined}>
                                <strong>{b.title}</strong>
                              </a>
                              : {b.description}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </section>
        )}
      </main>
      <footer className="site-footer">
        <span>
          <Crest /> {t.madeOf}
        </span>
        <span>
          HENRIQUE SANTOS DE SOUZA <span>{t.copyright}</span>
        </span>
      </footer>
      <span className="sr-only" role="status">
        {announcement}
      </span>
      {showAchievement && (
        <ExplorerAchievement onClose={() => setShowAchievement(false)} />
      )}
    </div>
  );
}
