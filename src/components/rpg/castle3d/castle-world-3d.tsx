import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls, useGLTF } from '@react-three/drei';
import { Box3, CanvasTexture, Color, DoubleSide, Group, Mesh, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, SRGBColorSpace, Vector3 } from 'three';
import { wall, doorway, base, mid, roof, keepBase, keepMid, keepRoof, tree, rock } from './castle-assets';

type Palette = Record<'sky' | 'grass' | 'grassLight' | 'water' | 'foam' | 'earth' | 'path' | 'flag' | 'pole', string>;
type Props = { reducedMotion: boolean; entering: boolean; reset: number; onReady: () => void; onFailure: () => void };

function readPalette(): Palette {
  const vars = getComputedStyle(document.documentElement);
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d');
  const color = (token: string) => {
    if (!ctx) return vars.getPropertyValue(token).trim();
    ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = vars.getPropertyValue(token).trim(); ctx.fillRect(0, 0, 1, 1);
    const p = ctx.getImageData(0, 0, 1, 1).data;
    return new Color().setRGB((p[0] ?? 0) / 255, (p[1] ?? 0) / 255, (p[2] ?? 0) / 255, SRGBColorSpace).getStyle();
  };
  return { sky: color('--castle-sky'), grass: color('--castle-grass'), grassLight: color('--castle-grass-light'), water: color('--castle-water'), foam: color('--steel'), earth: color('--stone-dark'), path: color('--floor'), flag: color('--gold'), pole: color('--wood') };
}

function texture(p: Palette, water = false) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = water ? p.water : p.grass; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = water ? p.foam : p.grassLight; ctx.globalAlpha = water ? .22 : .35;
    for (let i = 0; i < 380; i++) {
      const x = (i * 83 + Math.sin(i) * 50 + 256) % 256, y = (i * 47 + 256) % 256;
      ctx.fillRect(x, y, water ? 12 : 2, water ? 1 : 3);
    }
  }
  const tex = new CanvasTexture(canvas); tex.colorSpace = SRGBColorSpace; tex.wrapS = tex.wrapT = RepeatWrapping; tex.repeat.set(3, 3);
  return tex;
}

function Piece({ url, position, scale = 1, rotation = 0, sway = false, reducedMotion = false }: { url: string; position: [number, number, number]; scale?: number | [number, number, number]; rotation?: number; sway?: boolean; reducedMotion?: boolean }) {
  const { scene } = useGLTF(url);
  const ref = useRef<Group>(null);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new Box3().setFromObject(clone); const center = bounds.getCenter(new Vector3());
    clone.position.set(-center.x, -bounds.min.y, -center.z);
    clone.traverse(obj => { if (obj instanceof Mesh) { obj.castShadow = true; obj.receiveShadow = true; } });
    return clone;
  }, [scene]);
  const time = useRef(position[0]);
  useFrame((_, delta) => {
    if (!sway || reducedMotion || !ref.current) return;
    time.current += Math.min(delta, .05);
    ref.current.rotation.z = Math.sin(time.current * 1.5) * .022;
  });
  return <group ref={ref} position={position} scale={scale} rotation-y={rotation}><primitive object={model}/></group>;
}

function Flag({ position, palette, reducedMotion }: { position: [number, number, number]; palette: Palette; reducedMotion: boolean }) {
  const geo = useMemo(() => { const g = new PlaneGeometry(.7, .36, 12, 3); g.translate(.35, -.18, 0); return g; }, []);
  const time = useRef(0);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame((_, delta) => {
    if (reducedMotion) return;
    time.current += Math.min(delta, .05);
    const vertices = geo.attributes['position'];
    if (!vertices) return;
    for (let i = 0; i < vertices.count; i++) vertices.setZ(i, Math.sin(vertices.getX(i) * 9 - time.current * 4) * vertices.getX(i) * .16);
    vertices.needsUpdate = true; geo.computeVertexNormals();
  });
  return <group position={position}>
    <mesh position-y={.38} castShadow><cylinderGeometry args={[.018, .018, .8, 6]}/><meshStandardMaterial color={palette.pole}/></mesh>
    <mesh position-y={.77} geometry={geo} castShadow><meshStandardMaterial color={palette.flag} side={DoubleSide} roughness={.8}/></mesh>
  </group>;
}

function Landscape({ palette, reducedMotion }: { palette: Palette; reducedMotion: boolean }) {
  const grass = useMemo(() => texture(palette), [palette]);
  const water = useMemo(() => texture(palette, true), [palette]);
  useEffect(() => () => { grass.dispose(); water.dispose(); }, [grass, water]);
  useFrame((_, delta) => { if (!reducedMotion) water.offset.x += Math.min(delta, .05) * .018; });
  return <>
    <mesh position-y={-.42} receiveShadow><cylinderGeometry args={[5.2, 4.8, .8, 48]}/><meshStandardMaterial color={palette.earth} roughness={1} flatShading/></mesh>
    <mesh rotation-x={-Math.PI / 2} receiveShadow><circleGeometry args={[5.2, 48]}/><meshStandardMaterial map={grass} roughness={1}/></mesh>
    <mesh position-y={.025} rotation-x={-Math.PI / 2}><ringGeometry args={[3.2, 4.05, 64]}/><meshStandardMaterial map={water} metalness={.22} roughness={.24}/></mesh>
  </>;
}

// ─── Gate entrance: portal frame, wooden doors, and bridge ──────────────────
//
// Geometry reference (world units, Y-up, Z+ toward camera):
//   Wall face:        z = 2.00  (front of the muraille)
//   Doorway gap:      x = ±0.375 edges, total width ≈ 0.75
//   Wall height:      1.31 (glb) × scaleY 0.9 ≈ 1.18  → opening height 1.10
//   Wall depth (Z):   1.0 (glb) × scaleZ 0.45 = 0.45
//   All Y values measured from ground (y=0.065 baseline)

// ── 1. Stone portal frame ────────────────────────────────────────────────────
// A flat-faced stone frame sitting on the wall face (z=2.0), flush with the
// opening.  Uses a straight lintel — no arch — so it never overshoots the wall
// height and creates no floating geometry.

function StonePortal({ palette }: { palette: Palette }) {
  const STONE  = palette.earth;
  const STONE2 = '#a89880';   // lighter accent for lintel / quoins

  // Opening dimensions (must stay within the doorway gap)
  const OW = 0.72;   // opening width  (< gap 0.75 to leave room for frame)
  const OH = 1.10;   // opening height (< wall height 1.18)

  // Frame dimensions
  const PW = 0.10;   // pier width (each side)
  const LH = 0.12;   // lintel height
  const FD = 0.06;   // frame projection depth (toward camera)

  const Y = 0.065;   // ground offset
  const Z = 2.00;    // wall face

  // Quoin block positions on each pier (decorative raised blocks)
  const quoinY = [0.18, 0.46, 0.74, 1.00];

  return (
    <group position={[0, Y, Z]} name="stone-portal">
      {/* Left pier */}
      <mesh position={[-(OW / 2 + PW / 2), OH / 2, FD / 2]} castShadow receiveShadow>
        <boxGeometry args={[PW, OH + LH, FD]} />
        <meshStandardMaterial color={STONE} roughness={0.92} metalness={0} />
      </mesh>
      {/* Right pier */}
      <mesh position={[(OW / 2 + PW / 2), OH / 2, FD / 2]} castShadow receiveShadow>
        <boxGeometry args={[PW, OH + LH, FD]} />
        <meshStandardMaterial color={STONE} roughness={0.92} metalness={0} />
      </mesh>
      {/* Lintel (straight header over the opening) */}
      <mesh position={[0, OH + LH / 2, FD / 2]} castShadow receiveShadow>
        <boxGeometry args={[OW + PW * 2 + 0.02, LH, FD + 0.02]} />
        <meshStandardMaterial color={STONE2} roughness={0.85} metalness={0} />
      </mesh>
      {/* Quoin blocks on left pier */}
      {quoinY.map((qy, i) => (
        <mesh key={i} position={[-(OW / 2 + PW / 2), qy, FD + 0.008]} castShadow>
          <boxGeometry args={[PW + 0.02, 0.09, 0.022]} />
          <meshStandardMaterial color={STONE2} roughness={0.82} metalness={0} />
        </mesh>
      ))}
      {/* Quoin blocks on right pier */}
      {quoinY.map((qy, i) => (
        <mesh key={i} position={[(OW / 2 + PW / 2), qy, FD + 0.008]} castShadow>
          <boxGeometry args={[PW + 0.02, 0.09, 0.022]} />
          <meshStandardMaterial color={STONE2} roughness={0.82} metalness={0} />
        </mesh>
      ))}
      {/* Stone threshold (soleira) */}
      <mesh position={[0, -0.03, FD * 1.5]} receiveShadow>
        <boxGeometry args={[OW + PW * 2, 0.065, FD * 3]} />
        <meshStandardMaterial color={STONE2} roughness={0.95} metalness={0} />
      </mesh>
    </group>
  );
}

// ── 2. Static wooden gate ────────────────────────────────────────────────────
// Two closed door leaves, fully procedural, no animation.
// Each leaf: main panel + plank lines + cross-rails + metal hinges.

function WoodenDoorLeaf({ side }: { side: -1 | 1 }) {
  // Leaf dimensions
  const W = 0.325;   // width — two leaves cover 0.65 of the 0.72 opening
  const H = 1.44;    // height — 1/3 taller than original 1.08
  const D = 0.055;   // depth (3D thickness)

  // The doorway GLB has scaleZ=0.65, so the wall depth is 0.65 units.
  // The doorway is centred at z=2.0, so its front face is at z = 2.0 + 0.65/2 = 2.325.
  // Place the gate right at that front face so it is fully visible.
  const CX = side * (W / 2 + 0.01);
  const Z  = 2.30;   // front face of the doorway arch
  const Y  = 0.065 + H / 2;

  const WOOD_DARK  = '#4a3020';
  const WOOD_MID   = '#5c3c22';
  const WOOD_LIGHT = '#6b4828';
  const IRON       = '#2a2825';

  const plankX = [-W * 0.25, W * 0.25];
  const railY  = [H * 0.18 - H / 2, H * 0.50 - H / 2, H * 0.82 - H / 2];

  return (
    <group position={[CX, Y, Z]} name={`door-leaf-${side < 0 ? 'left' : 'right'}`}>
      {/* Main panel */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.88} metalness={0.04} />
      </mesh>

      {/* Vertical plank lines */}
      {plankX.map((px, i) => (
        <mesh key={i} position={[px, 0, D / 2 + 0.003]}>
          <boxGeometry args={[0.012, H * 0.96, 0.008]} />
          <meshStandardMaterial color={WOOD_MID} roughness={0.9} metalness={0} />
        </mesh>
      ))}

      {/* Horizontal cross-rails */}
      {railY.map((ry, i) => (
        <mesh key={i} position={[0, ry, D / 2 + 0.006]} castShadow>
          <boxGeometry args={[W * 0.92, 0.055, 0.014]} />
          <meshStandardMaterial color={WOOD_LIGHT} roughness={0.84} metalness={0} />
        </mesh>
      ))}

      {/* Metal hinge plates on outer edge */}
      {[H * 0.22 - H / 2, H * 0.78 - H / 2].map((hy, i) => (
        <mesh key={i} position={[side * W / 2, hy, 0]} castShadow>
          <boxGeometry args={[0.018, 0.07, D + 0.008]} />
          <meshStandardMaterial color={IRON} roughness={0.55} metalness={0.7} />
        </mesh>
      ))}

      {/* Centre seam (closing edge) */}
      <mesh position={[-side * W / 2, 0, D / 2 + 0.002]}>
        <boxGeometry args={[0.008, H, 0.006]} />
        <meshStandardMaterial color="#1a0f08" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

function CastleGate() {
  return (
    <group name="castle-gate">
      <WoodenDoorLeaf side={-1} />
      <WoodenDoorLeaf side={1}  />
    </group>
  );
}

// ── 3. Bridge ────────────────────────────────────────────────────────────────
// Stone-slab bridge replacing the old flat path.  Width matches the opening,
// stone slabs on top, low guard edges, stone abutments at each end.

function GateBridge({ palette }: { palette: Palette }) {
  const W      = 0.80;   // bridge width = slightly wider than door opening (0.72)
  const LEN    = 4.20;   // total bridge length (same footprint as old path)
  const Z_CTR  = 2.35;   // z centre
  const Y_DECK = 0.062;  // deck surface Y
  const SLAB_D = 0.05;   // deck thickness

  const STONE  = palette.earth;
  const STONE2 = '#a89880';

  // Slab division lines (top face) — every ~0.4 units along Z
  const slabCount = 10;

  return (
    <group name="gate-bridge">
      {/* ── Deck slab ── */}
      <mesh position={[0, Y_DECK - SLAB_D / 2, Z_CTR]} castShadow receiveShadow>
        <boxGeometry args={[W, SLAB_D, LEN]} />
        <meshStandardMaterial color={STONE} roughness={0.96} metalness={0} />
      </mesh>

      {/* ── Slab joint lines (thin dark strips across the bridge top) ── */}
      {Array.from({ length: slabCount - 1 }, (_, i) => {
        const z = Z_CTR - LEN / 2 + (i + 1) * (LEN / slabCount);
        return (
          <mesh key={i} position={[0, Y_DECK + 0.001, z]}>
            <boxGeometry args={[W, 0.004, 0.012]} />
            <meshStandardMaterial color="#3a2e22" roughness={1} metalness={0} />
          </mesh>
        );
      })}

      {/* ── Low guard edges (left and right) ── */}
      {([-1, 1] as const).map(side => (
        <mesh key={side} position={[side * (W / 2 + 0.025), Y_DECK + 0.04, Z_CTR]} castShadow receiveShadow>
          <boxGeometry args={[0.05, 0.08, LEN]} />
          <meshStandardMaterial color={STONE2} roughness={0.9} metalness={0} />
        </mesh>
      ))}

      {/* ── Stone abutment at castle end (connects bridge to threshold) ── */}
      <mesh position={[0, Y_DECK - 0.02, 2.06]} castShadow receiveShadow>
        <boxGeometry args={[W + 0.14, 0.10, 0.18]} />
        <meshStandardMaterial color={STONE2} roughness={0.88} metalness={0} />
      </mesh>

      {/* ── Stone abutment at far end ── */}
      <mesh position={[0, Y_DECK - 0.02, 4.44]} castShadow receiveShadow>
        <boxGeometry args={[W + 0.14, 0.10, 0.18]} />
        <meshStandardMaterial color={STONE2} roughness={0.88} metalness={0} />
      </mesh>
    </group>
  );
}



function Castle({ palette, reducedMotion, entering, onReady }: { palette: Palette; reducedMotion: boolean; entering: boolean; onReady: () => void }) {
  useEffect(() => { onReady(); }, [onReady]);
  const corners: [number, number, number][] = [[-2, .06, -2], [2, .06, -2], [-2, .06, 2], [2, .06, 2]];
  return <>
    {corners.map(([x, y, z], i) => <group key={i} position={[x, y, z]}>
      <Piece url={base.url} position={[0, 0, 0]} scale={1.25}/>
      <Piece url={mid.url} position={[0, 1.5, 0]} scale={1.25}/>
      <Piece url={roof.url} position={[0, 2.02, 0]} scale={1.35}/>
      <Flag position={[0, 3.08, 0]} palette={palette} reducedMotion={reducedMotion}/>
    </group>)}
    {[-1, 0, 1].map(x => <group key={x}>
      <Piece url={wall.url} position={[x, .06, -2]} scale={[1, .9, .45]}/>
      {x !== 0 && <Piece url={wall.url} position={[x, .06, 2]} scale={[1, .9, .45]}/>}
      <Piece url={wall.url} position={[-2, .06, x]} scale={[1, .9, .45]} rotation={Math.PI / 2}/>
      <Piece url={wall.url} position={[2, .06, x]} scale={[1, .9, .45]} rotation={Math.PI / 2}/>
    </group>)}
    <Piece url={doorway.url} position={[-.375, .06, 2]} scale={[1.5, 1.3, .65]}/>
    <Piece url={doorway.url} position={[.375, .06, 2]} scale={[1.5, 1.3, .65]} rotation={Math.PI}/>
    <StonePortal palette={palette}/>
    <GateBridge palette={palette}/>
    <CastleGate />
    <group position={[0, .06, -.65]}>
      <Piece url={keepBase.url} position={[0, 0, 0]} scale={[1.7, 1.3, 1.5]}/>
      <Piece url={keepMid.url} position={[0, 1.3, 0]} scale={[1.7, 1.25, 1.5]}/>
      <Piece url={keepRoof.url} position={[0, 2.55, 0]} scale={[1.8, 1.1, 1.6]}/>
      <Flag position={[0, 4.04, 0]} palette={palette} reducedMotion={reducedMotion}/>
    </group>
    {[-1, 1].map(side => <Piece key={side} url={keepRoof.url} position={[side * 1.05, 1.22, -.65]} scale={[.8, .75, 1.3]}/>)}
    {Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * Math.PI * 2 + .5;
      return <Piece key={i} url={tree.url} position={[Math.cos(angle) * 4.45, .05, Math.sin(angle) * 4.45]} scale={.65 + (i % 3) * .12} sway reducedMotion={reducedMotion}/>;
    })}
    {[[-4, .02, 1], [3.8, .02, -2.6], [-1.5, .02, 4.4]].map((p, i) => <Piece key={i} url={rock.url} position={p as [number, number, number]} scale={.65}/>)}
  </>;
}

function CameraRig({ entering, reset, reducedMotion }: Pick<Props, 'entering' | 'reset' | 'reducedMotion'>) {
  const { camera, size, invalidate } = useThree();
  const controls = useRef<React.ElementRef<typeof OrbitControls>>(null);
  const initial = useMemo(() => new Vector3(8, 6.8, 10).multiplyScalar(size.width < 600 ? 1.35 : 1), [size.width]);
  const target = useMemo(() => new Vector3(0, 1.2, 0), []);
  const door = useMemo(() => new Vector3(.1, 1.15, 4.5), []);
  const elapsed = useRef(0);
  useEffect(() => { elapsed.current = 0; }, [entering]);
  useEffect(() => { camera.position.copy(initial); controls.current?.target.copy(target); controls.current?.update(); invalidate(); }, [reset, initial, camera, target, invalidate]);
  useFrame((_, rawDelta) => {
    if (!entering || reducedMotion) return;
    elapsed.current += Math.min(rawDelta, .05);
    camera.position.lerp(door, 1 - Math.exp(-3 * Math.min(rawDelta, .05)));
    camera.lookAt(0, .85, 2);
    if (elapsed.current > 1.4) door.z = Math.max(2.7, door.z - Math.min(rawDelta, .05) * 1.8);
  });
  return <OrbitControls ref={controls} enabled={!entering} target={[0, 1.2, 0]} enablePan={false} enableZoom={false} minPolarAngle={.6} maxPolarAngle={1.35} enableDamping={!reducedMotion} autoRotate={false}/>;
}

export default function CastleWorld3D(props: Props) {
  const [palette, setPalette] = useState<Palette | null>(null);
  useEffect(() => {
    setPalette(readPalette());
    // Relê as cores quando o tema (classe "dark" em <html>) muda.
    const observer = new MutationObserver(() => setPalette(readPalette()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  if (!palette) return null;
  return <Canvas shadows dpr={[1, 1.5]} camera={{ position: [8, 6.8, 10], fov: 44 }} frameloop={props.reducedMotion ? 'demand' : 'always'} gl={{ antialias: true, preserveDrawingBuffer: true }} onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', props.onFailure, { once: true }); }}>
    <color attach="background" args={[palette.sky]}/>
    <hemisphereLight args={[palette.sky, palette.grass, 1.3]}/>
    <directionalLight position={[-5, 10, 6]} intensity={2.4} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-bias={-.0003}/>
    <Environment resolution={64}><Lightformer position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} intensity={.7}/><Lightformer color={palette.sky} position={[-5, 3, 0]} rotation-y={Math.PI / 2} scale={[10, 10, 1]} intensity={.5}/></Environment>
    <Landscape palette={palette} reducedMotion={props.reducedMotion}/>
    <Suspense fallback={null}><Castle palette={palette} reducedMotion={props.reducedMotion} entering={props.entering} onReady={props.onReady}/></Suspense>
    <CameraRig entering={props.entering} reducedMotion={props.reducedMotion} reset={props.reset}/>
  </Canvas>;
}
