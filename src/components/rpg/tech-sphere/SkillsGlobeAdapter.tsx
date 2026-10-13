/**
 * SkillsGlobeAdapter — wraps the original SkillsGlobe logic with the
 * project's own theme hook and a minimal i18n shim.
 *
 * The ONLY changes from the original SkillsGlobe.jsx are:
 *   1. `import { useTranslation } from 'react-i18next'`  →  inline shim below
 *   2. `import { useTheme } from '../theme/themeContext'` →  @/hooks/use-theme
 *   3. `import './SkillsGlobe.css'`                      →  kept (same path)
 *   4. Props type annotation added for TypeScript.
 *
 * All logic, constants, and JSX are identical to the original.
 */
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import { useTheme } from '@/hooks/use-theme';
import './original/SkillsGlobe.css';

// ── i18n shim ─────────────────────────────────────────────────────────────────
const _translations: Record<string, string> = {
  'habilidades.globoDica': 'Arraste para girar • clique para selecionar',
  'habilidades.verRepositorio': 'Ver repositório de {{name}}',
};
function _t(key: string, vars?: Record<string, string>): string {
  let v = _translations[key] ?? key;
  if (vars) for (const [k, val] of Object.entries(vars)) v = v.replace(`{{${k}}}`, val);
  return v;
}
function useTranslation() {
  return { t: _t };
}

// ── Types ─────────────────────────────────────────────────────────────────────
export type GlobeSkill = {
  name: string;
  color: string;
  link: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

// ── Constants (identical to original) ────────────────────────────────────────
const ICON_PX = 40;
const RADIUS = 3.3;
const DRAG_THRESHOLD = 6;
const UNMOUNT_DELAY_MS = 1500;

const _world = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _camDir = new THREE.Vector3();
const _ndc = new THREE.Vector3();
const _view = new THREE.Vector3();

// ── fibonacciSphere (identical) ───────────────────────────────────────────────
function fibonacciSphere(n: number, radius: number): THREE.Vector3[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / n;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return new THREE.Vector3(
      Math.cos(theta) * r,
      y,
      Math.sin(theta) * r,
    ).multiplyScalar(radius);
  });
}

// ── Globe (identical) ─────────────────────────────────────────────────────────
function Globe({
  count,
  radius,
  accent,
  items,
  motion,
  light,
  pose,
}: {
  count: number;
  radius: number;
  accent: string;
  items: React.MutableRefObject<(HTMLElement | null)[]>;
  motion: boolean;
  light: boolean;
  pose: React.MutableRefObject<{ rotationY: number; camera: THREE.Vector3 | null }>;
}) {
  const group = useRef<THREE.Group>(null);
  const points = useMemo(() => fibonacciSphere(count, radius), [count, radius]);
  const shell = radius * 0.85;
  const iconWorld = THREE.MathUtils.clamp((radius * 0.8) / Math.sqrt(count), 0.32, 0.6);

  useLayoutEffect(() => {
    if (group.current) group.current.rotation.y = pose.current.rotationY;
  }, [pose]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const { camera } = state;
    const { width, height } = state.size;

    if (motion) g.rotation.y += delta * 0.06;
    pose.current.rotationY = g.rotation.y;
    (pose.current.camera ??= new THREE.Vector3()).copy(camera.position);
    g.updateWorldMatrix(true, false);
    camera.updateMatrixWorld();
    _camDir.copy(camera.position).normalize();
    const tanHalfFov = Math.tan(THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov) / 2);

    points.forEach((p, i) => {
      const el = items.current[i];
      if (!el) return;
      _world.copy(p).applyMatrix4(g.matrixWorld);
      const t = THREE.MathUtils.clamp((_dir.copy(_world).normalize().dot(_camDir) - 0.1) * 2, 0, 1);
      _ndc.copy(_world).project(camera);
      const x = (_ndc.x + 1) * 0.5 * width;
      const y = (1 - _ndc.y) * 0.5 * height;
      const depth = -_view.copy(_world).applyMatrix4(camera.matrixWorldInverse).z;
      const pxPerUnit = height / (2 * tanHalfFov * depth);
      const scale = ((iconWorld * pxPerUnit) / ICON_PX) * (0.8 + 0.4 * t);

      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
      el.style.opacity = String(t);
      el.style.zIndex = String(Math.round(t * 100));
      el.style.pointerEvents = t > 0.8 ? 'auto' : 'none';
      el.style.visibility = t < 0.02 ? 'hidden' : 'visible';
    });
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[shell, 2]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={light ? 0.35 : 0.1} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[shell, 2]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={light ? 0.1 : 0.03} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[shell * 0.98, 32, 32]} />
        <meshBasicMaterial color={light ? '#fff' : '#000'} transparent opacity={light ? 0.25 : 0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[shell * 1.035, 32, 32]} />
        <meshBasicMaterial color={accent} transparent opacity={0.06} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// ── FitCamera (identical) ─────────────────────────────────────────────────────
function FitCamera({
  radius,
  pose,
}: {
  radius: number;
  pose: React.MutableRefObject<{ rotationY: number; camera: THREE.Vector3 | null }>;
}) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const aspect = useThree((s) => s.size.width / s.size.height);

  useLayoutEffect(() => {
    if (pose.current.camera) camera.position.copy(pose.current.camera);
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    camera.position.setLength(radius / Math.sin(Math.min(vFov, hFov) / 2));
  }, [camera, aspect, radius, pose]);

  return null;
}

// ── helpers (identical) ───────────────────────────────────────────────────────
const readToken = (el: Element, name: string, fallback: string) =>
  getComputedStyle(el).getPropertyValue(name).trim() || fallback;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// ── SkillsGlobeAdapter (replaces SkillsGlobe default export) ─────────────────
export default function SkillsGlobeAdapter({ skills }: { skills: GlobeSkill[] }) {
  const { t } = useTranslation();
  const { resolved } = useTheme();
  const theme = resolved; // 'light' | 'dark'
  const container = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLAnchorElement | null)[]>([]);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [colors, setColors] = useState({ accent: '#00ff9d', bg: '#252a33' });
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);
  const pose = useRef<{ rotationY: number; camera: THREE.Vector3 | null }>({ rotationY: 0, camera: null });
  const [motion] = useState(() => !prefersReducedMotion());
  const light = theme === 'light';

  useLayoutEffect(() => {
    const el = container.current;
    if (!el) return;
    const read = () =>
      setColors({
        accent: readToken(el, '--mana', '#00ff9d'),
        bg: readToken(el, '--background', '#252a33'),
      });
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    const el = container.current;
    if (!el || !('IntersectionObserver' in window)) return;
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer);
        setVisible(entry?.isIntersecting ?? false);
        if (entry?.isIntersecting) setMounted(true);
        else timer = setTimeout(() => setMounted(false), UNMOUNT_DELAY_MS);
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(el);
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  const onClickCapture = (e: React.MouseEvent) => {
    const start = dragStart.current;
    if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > DRAG_THRESHOLD) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="skills-globe">
      <div
        ref={container}
        className="skills-globe__stage"
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
      >
        {mounted && (
          <Canvas
            eventSource={container as React.RefObject<HTMLElement>}
            frameloop={visible ? 'always' : 'never'}
            camera={{ position: [0, 0, 9], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true }}
          >
            {!light && <fog attach="fog" args={[colors.bg, 10, 25]} />}
            <FitCamera radius={RADIUS * 1.2} pose={pose} />
            <Float
              speed={motion ? 1 : 0}
              rotationIntensity={motion ? 0.2 : 0}
              floatIntensity={motion ? 0.2 : 0}
            >
              <Globe
                count={skills.length}
                radius={RADIUS}
                accent={colors.accent}
                items={items}
                motion={motion}
                light={light}
                pose={pose}
              />
            </Float>
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={motion}
              autoRotateSpeed={0.8}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Canvas>
        )}

        <ul className="skills-globe__layer">
          {skills.map((skill, i) => {
            const Icon = skill.icon;
            return (
              <li key={skill.name} className="skills-globe__li">
                <a
                  ref={(el) => {
                    items.current[i] = el;
                  }}
                  className="skills-globe__item"
                  style={{ '--skill': skill.color } as React.CSSProperties}
                  href={skill.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={false}
                  aria-label={
                    skill.link.includes('github.com')
                      ? t('habilidades.verRepositorio', { name: skill.name })
                      : skill.name
                  }
                >
                  {typeof Icon === 'string' ? (
                    <span className="skills-globe__icon" aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20 }}>
                      {Icon}
                    </span>
                  ) : (
                    <Icon className="skills-globe__icon" aria-hidden="true" />
                  )}
                  <span className="skills-globe__label">{skill.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="skills-globe__hint">{t('habilidades.globoDica')}</p>
    </div>
  );
}
