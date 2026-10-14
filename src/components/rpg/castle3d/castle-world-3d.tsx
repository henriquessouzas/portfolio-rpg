import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls, useGLTF } from '@react-three/drei';
import { Box3, CanvasTexture, Color, DoubleSide, Group, Mesh, PlaneGeometry, RepeatWrapping, SRGBColorSpace, Vector3 } from 'three';
import { wall, doorway, gate, base, mid, roof, keepBase, keepMid, keepRoof, tree, rock } from './castle-assets';

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
    <mesh position={[0, .055, 2.35]} rotation-x={-Math.PI / 2} receiveShadow><planeGeometry args={[1.05, 4.2]}/><meshStandardMaterial color={palette.path} roughness={1}/></mesh>
  </>;
}

function CastleGate({ entering, reducedMotion }: Pick<Props, 'entering' | 'reducedMotion'>) {
  const { scene } = useGLTF(gate.url);
  const left = useRef<Group>(null);
  const right = useRef<Group>(null);
  const elapsed = useRef(0);
  // The source is a complete arched gate. Split its geometry at the centre
  // so the two halves preserve its timber, arch and ironwork as they swing.
  const leaves = useMemo(() => [-1, 1].map(side => {
    const leaf = scene.clone(true);
    leaf.traverse(object => {
      if (!(object instanceof Mesh)) return;
      const geometry = object.geometry.clone();
      const positions = geometry.getAttribute('position');
      const original = geometry.getIndex();
      const indices: number[] = [];
      const count = original?.count ?? positions.count;
      for (let i = 0; i < count; i += 3) {
        const a = original?.getX(i) ?? i;
        const b = original?.getX(i + 1) ?? i + 1;
        const c = original?.getX(i + 2) ?? i + 2;
        if ((positions.getZ(a) + positions.getZ(b) + positions.getZ(c)) * side >= 0) indices.push(a, b, c);
      }
      geometry.setIndex(indices); object.geometry = geometry;
      object.castShadow = true; object.receiveShadow = true;
    });
    return leaf;
  }), [scene]);
  useEffect(() => () => leaves.forEach(leaf => leaf.traverse(object => { if (object instanceof Mesh) object.geometry.dispose(); })), [leaves]);
  useEffect(() => { elapsed.current = 0; }, [entering]);
  useFrame((_, rawDelta) => {
    if (!left.current || !right.current) return;
    elapsed.current = entering ? elapsed.current + Math.min(rawDelta, .05) : 0;
    const progress = reducedMotion ? Number(entering) : Math.min(1, Math.max(0, (elapsed.current - .25) / 1.1));
    const angle = progress * progress * (3 - 2 * progress) * Math.PI * .46;
    left.current.rotation.y = angle;
    right.current.rotation.y = -angle;
  });
  return <group position={[0, .065, 2.24]} name="castle-gate">
    <group ref={left} position-x={-.497} name="gate-left-hinge"><group position-x={.497} rotation-y={Math.PI / 2} scale={[1, 1.3, 1.5]}><primitive object={leaves[0]}/></group></group>
    <group ref={right} position-x={.497} name="gate-right-hinge"><group position-x={-.497} rotation-y={Math.PI / 2} scale={[1, 1.3, 1.5]}><primitive object={leaves[1]}/></group></group>
  </group>;
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
    <CastleGate entering={entering} reducedMotion={reducedMotion}/>
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
