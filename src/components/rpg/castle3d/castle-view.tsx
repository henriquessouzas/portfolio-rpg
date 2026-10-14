import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, RotateCcw, Pause, Play } from 'lucide-react';
import { Button } from '@/components/rpg/ui/button';
import { WindScene } from '../wind-scene';

const CastleWorld = lazy(() => import('./castle-world-3d'));

class GraphicsBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export type CastleMode = '3d' | 'image';

export function CastleView({ reducedMotion, entering, onEnter, onModeChange }: { reducedMotion: boolean; entering: boolean; onEnter: () => void; onModeChange?: (mode: CastleMode) => void }) {
  const [supported, setSupported] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reset, setReset] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const probe = document.createElement('canvas');
    const context = probe.getContext('webgl2');
    setSupported(Boolean(context));
    context?.getExtension('WEBGL_lose_context')?.loseContext();
  }, []);
  useEffect(() => { onModeChange?.(supported ? '3d' : 'image'); }, [supported, onModeChange]);
  // Sem 3D, mantém a imagem em pixel art com vento (a cena anterior).
  const fallback = <WindScene reducedMotion={reducedMotion} />;
  return <div className={`castle-stage ${entering && !supported ? 'castle-entering' : ''}`} role="group" aria-label="Castelo de Henrique">
    <GraphicsBoundary fallback={fallback}>
      {supported ? <Suspense fallback={fallback}>
        <CastleWorld reducedMotion={reducedMotion || (paused && !entering)} entering={entering} reset={reset} onReady={() => setReady(true)} onFailure={() => setSupported(false)} />
      </Suspense> : fallback}
    </GraphicsBoundary>
    {supported && !ready && <span className="castle-loading" role="status">Construindo o reino…</span>}
    <span className="world-label"><span className="live-dot"/> REINO DE HENRIQUE</span>
    {supported && <div className="castle-tools">
      <Button variant="parchment" size="icon" title="Restaurar vista" aria-label="Restaurar vista" onClick={() => setReset(v => v + 1)} disabled={entering}><RotateCcw/></Button>
      <Button variant="parchment" size="icon" title={paused ? 'Retomar animação' : 'Pausar animação'} aria-label={paused ? 'Retomar animação' : 'Pausar animação'} aria-pressed={paused} onClick={() => setPaused(v => !v)} disabled={entering || reducedMotion}>{paused ? <Play/> : <Pause/>}</Button>
    </div>}
    <Button variant="pixel" className="castle-cta" disabled={entering} onClick={onEnter}>{entering ? 'Abrindo os portões…' : 'Entrar no castelo'}{!entering && <ArrowRight size={18}/>}</Button>
    <span className="castle-coordinate">EST. 2026 <span>✦</span> UMA NOVA JORNADA</span>
  </div>;
}
