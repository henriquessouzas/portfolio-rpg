import { Button } from '@/components/rpg/ui/button';
import { roomLayouts, type Fixture } from '@/lib/room-layouts';
import type { Artifact, Point, Room } from '@/lib/portfolio-data';
import { Hero, ObjectArt } from './art';

function Furniture({ fixture: f, art }: { fixture: Fixture; art?: string | undefined }) {
  const w = f.w * 48,
    h = f.h * 48;
  const icon = (kind: string, x: number, y: number, size: number) => (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 64 64">
      <ObjectArt kind={kind} />
    </svg>
  );
  const table = (
    <>
      <rect
        x="3"
        y={h * 0.42}
        width={w - 6}
        height={h * 0.46}
        className="fill-wood stroke-ink"
        strokeWidth="3"
      />
      <path
        d={`M10 ${h * 0.87}v${h * 0.13}M${w - 10} ${h * 0.87}v${h * 0.13}`}
        className="stroke-wood"
        strokeWidth="9"
      />
      <path d={`M8 ${h * 0.5}h${w - 16}`} className="stroke-gold" opacity=".3" strokeWidth="3" />
    </>
  );
  let contents;
  switch (f.kind) {
    case 'shelf':
    case 'cabinet':
    case 'trophy-case': {
      contents = (
        <>
          <rect width={w} height={h} className="fill-wood stroke-ink" strokeWidth="4" />
          {[0, 1, 2].map((row) => (
            <g key={row}>
              <rect
                x="8"
                y={8 + (row * h) / 3}
                width={w - 16}
                height={h / 3 - 14}
                className="fill-ink"
              />
              {Array.from({ length: Math.floor(w / 17) - 1 }, (_, i) => (
                <g key={i}>
                  <rect
                    x={12 + i * 17}
                    y={15 + (row * h) / 3 + (i % 3) * 3}
                    width="12"
                    height={h / 3 - 22 - (i % 3) * 3}
                    className={
                      ['fill-ember', 'fill-forest', 'fill-mana', 'fill-gold', 'fill-royal'][i % 5]
                    }
                  />
                  <path
                    d={`M${14 + i * 17} ${22 + (row * h) / 3}h8`}
                    className="stroke-surface"
                    strokeWidth="2"
                    opacity=".6"
                  />
                </g>
              ))}
            </g>
          ))}
          {f.kind === 'trophy-case' && (
            <>
              <rect x="10" y="10" width={w - 20} height={h - 20} className="fill-wood" />
              {icon('trophy', w * 0.22, h * 0.18, w * 0.6)}
              <path d={`M8 ${h * 0.82}h${w - 16}`} className="stroke-gold" strokeWidth="5" />
            </>
          )}
          {art && f.kind === 'shelf' && icon(art, w * 0.37, h * 0.52, w * 0.28)}
        </>
      );
      break;
    }
    case 'reading':
    case 'writing':
    case 'work-desk':
    case 'blue-workbench':
    case 'green-workbench':
    case 'mail':
      contents = (
        <>
          {table}
          {icon(art ?? 'book', w * 0.25, 0, Math.min(w * 0.48, h * 0.7))}
          {f.kind === 'work-desk' && icon('books', w * 0.7, h * 0.17, w * 0.2)}
          {f.kind.includes('workbench') && (
            <>
              <path
                d={`M${w * 0.12} ${h * 0.42}v-24h10v24M${w * 0.8} ${h * 0.42}v-30h12v30`}
                className="stroke-steel"
                strokeWidth="4"
              />
              <circle cx={w * 0.85} cy={h * 0.3} r="8" className="fill-royal" />
            </>
          )}
          {f.kind === 'reading' && (
            <>
              <rect
                x={w * 0.35}
                y={h * 0.85}
                width={w * 0.3}
                height="25"
                className="fill-ember stroke-wood"
                strokeWidth="4"
              />
            </>
          )}
        </>
      );
      break;
    case 'large-bed':
      contents = (
        <>
          <rect
            x="7"
            y="7"
            width={w - 14}
            height={h - 14}
            className="fill-wood stroke-ink"
            strokeWidth="4"
          />
          <rect x="17" y="24" width={w - 34} height={h - 48} className="fill-surface" />
          <rect x="29" y="33" width={w - 58} height="44" rx="5" className="fill-steel" />
          <rect x="17" y="90" width={w - 34} height={h - 114} className="fill-royal" />
          <path
            d={`M23 101h${w - 46}M23 ${h - 40}h${w - 46}`}
            className="stroke-gold"
            strokeWidth="5"
          />
          <rect
            x="5"
            y="0"
            width={w - 10}
            height="19"
            className="fill-wood stroke-gold"
            strokeWidth="2"
          />
        </>
      );
      break;
    case 'royal-throne':
      contents = (
        <>
          <path
            d={`M0 ${h * 0.7}h${w}v${h * 0.3}H0z`}
            className="fill-stone-dark stroke-gold"
            strokeWidth="3"
          />
          {icon('throne', w * 0.17, 0, w * 0.66)}
        </>
      );
      break;
    case 'wall-poster':
      contents = icon('poster', 0, 0, Math.min(w, h));
      break;
    case 'treasure':
      contents = icon('chest', w * 0.12, 0, w * 0.76);
      break;
    case 'weapon-rack':
    case 'bow-rack':
    case 'shield-rack':
      contents = (
        <>
          <rect
            x="8"
            y="8"
            width={w - 16}
            height={h - 16}
            className="fill-wood stroke-ink"
            strokeWidth="4"
          />
          <path
            d={`M15 20h${w - 30}M15 ${h - 25}h${w - 30}`}
            className="stroke-gold"
            strokeWidth="4"
          />
          {icon(art ?? 'sword', w * 0.22, h * 0.09, w * 0.57)}
        </>
      );
      break;
    case 'forge':
      contents = (
        <>
          <rect
            x="8"
            y="8"
            width={w - 16}
            height={h - 20}
            className="fill-stone-dark stroke-ink"
            strokeWidth="4"
          />
          <rect x="20" y="20" width={w - 40} height="39" className="fill-ink" />
          <path d={`M26 54l12-25 12 15 8-27 20 34 12-10 16 13z`} className="fill-ember torch" />
          {icon('anvil', w * 0.2, h * 0.4, w * 0.6)}
        </>
      );
      break;
    case 'alchemy':
      contents = (
        <>
          <ellipse cx={w / 2} cy={h * 0.8} rx={w * 0.42} ry={h * 0.18} className="fill-ember" />
          {icon('cauldron', w * 0.12, 0, w * 0.76)}
          <g className="alchemy-steam">
            <path
              d={`M${w * 0.4} 25q-15-15 0-30m${w * 0.2} 25q15-15 0-30`}
              className="stroke-forest"
              fill="none"
              strokeWidth="5"
              opacity=".5"
            />
          </g>
        </>
      );
      break;
    case 'plant':
      contents = (
        <>
          <path
            d={`M${w * 0.25} ${h * 0.62}h${w * 0.5}l-8 ${h * 0.32}h-${w * 0.5 - 16}z`}
            className="fill-ember stroke-wood"
            strokeWidth="3"
          />
          <path
            d={`M${w * 0.5} ${h * 0.65}v-${h * 0.5}`}
            className="stroke-forest"
            strokeWidth="8"
          />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <ellipse
                cx={w * 0.3}
                cy={h * (0.22 + i * 0.14)}
                rx={w * 0.23}
                ry="12"
                className="fill-forest"
              />
              <ellipse
                cx={w * 0.7}
                cy={h * (0.29 + i * 0.14)}
                rx={w * 0.23}
                ry="12"
                className="fill-forest"
              />
            </g>
          ))}
        </>
      );
      break;
    case 'training':
      contents = (
        <>
          <path
            d={`M${w / 2} 10v${h - 15}m-${w * 0.3}-${h * 0.7}h${w * 0.6}`}
            className="stroke-wood"
            strokeWidth="8"
          />
          <ellipse
            cx={w / 2}
            cy={h * 0.4}
            rx={w * 0.22}
            ry={h * 0.32}
            className="fill-floor-dark stroke-wood"
            strokeWidth="4"
          />
        </>
      );
      break;
    default:
      contents = (
        <>
          {[0, 1].map((i) => (
            <g key={i} transform={`translate(${i * w * 0.4} ${i * 12})`}>
              <rect
                x="8"
                y="15"
                width={w * 0.5}
                height={h * 0.65}
                className="fill-wood stroke-ink"
                strokeWidth="3"
              />
              <path
                d={`M10 17l${w * 0.45} ${h * 0.6}m-${w * 0.45} 0L${w * 0.5} 17`}
                className="stroke-gold"
                strokeWidth="3"
                opacity=".45"
              />
            </g>
          ))}
        </>
      );
  }
  return (
    <g transform={`translate(${f.x * 48} ${f.y * 48})`}>
      <ellipse cx={w / 2} cy={h * 0.95} rx={w * 0.48} ry="9" className="sprite-shadow" />
      {contents}
    </g>
  );
}

export function RoomScene({
  room,
  position,
  selected,
  walking,
  onPick,
}: {
  room: Room;
  position: Point;
  selected: Artifact | null;
  walking: boolean;
  onPick: (a: Artifact, i: number) => void;
}) {
  return (
    <div className={`room-world furnished-room room-${room.id}`}>
      <svg className="furnished-art" viewBox="0 0 960 672" aria-hidden="true">
        <rect width="960" height="672" className="fill-floor" />
        {Array.from({ length: 20 }, (_, x) =>
          Array.from({ length: 14 }, (_, y) => (
            <g key={`${x},${y}`}>
              <rect
                x={x * 48}
                y={y * 48}
                width="48"
                height="48"
                fill="none"
                className="stroke-floor-dark"
                strokeWidth="1"
              />
              {(x + y) % 3 === 0 && (
                <path
                  d={`M${x * 48 + 9} ${y * 48 + 12}h13`}
                  className="stroke-floor-dark"
                  opacity=".25"
                />
              )}
            </g>
          )),
        )}
        <rect x="48" y="48" width="864" height="74" className="fill-stone" />
        {Array.from({ length: 18 }, (_, i) => (
          <path d={`M${48 + i * 48} 48v72`} className="stroke-stone-dark" key={i} opacity=".5" />
        ))}
        <path d="M48 120h864" className="stroke-stone-dark" strokeWidth="8" />
        <path
          d="M0 0h960v48H0zM0 0h48v672H0zM912 0h48v672h-48zM0 624h432v48H0zM528 624h432v48H528z"
          className="fill-stone-dark stroke-ink"
          strokeWidth="3"
        />
        {[240, 672].map((x) => (
          <g key={x}>
            <rect x={x} y="49" width="48" height="62" className="fill-ink" />
            <rect x={x + 5} y="53" width="38" height="52" className="fill-mana" />
            <path d={`M${x + 24} 53v52m-19-25h38`} className="stroke-steel" strokeWidth="4" />
          </g>
        ))}
        <rect
          x={room.id === 'T' ? 408 : 336}
          y="264"
          width={room.id === 'T' ? 144 : 288}
          height="312"
          className="rug"
        />
        <rect
          x={room.id === 'T' ? 419 : 347}
          y="277"
          width={room.id === 'T' ? 122 : 266}
          height="286"
          fill="none"
          className="stroke-gold"
          strokeWidth="3"
          opacity=".7"
        />
        <rect x="437" y="624" width="86" height="48" className="fill-wood" />
        <path d="M452 628v40m17-40v40m17-40v40m17-40v40" className="stroke-gold" opacity=".4" />
        {roomLayouts[room.id].map((f, i) => (
          <Furniture
            key={i}
            fixture={f}
            art={f.object === undefined ? undefined : room.objects[f.object]?.art}
          />
        ))}
      </svg>
      {roomLayouts[room.id].map((f, i) => {
        const obj = f.object === undefined ? undefined : room.objects[f.object];
        if (!obj || f.object === undefined) return null;
        const index = f.object;
        return (
          <Button
            variant="artifact"
            key={i}
            className={`fixture-hit ${selected === obj ? 'fixture-selected' : ''}`}
            style={{
              left: `${(f.x / 20) * 100}%`,
              top: `${(f.y / 14) * 100}%`,
              width: `${(f.w / 20) * 100}%`,
              height: `${(f.h / 14) * 100}%`,
            }}
            onClick={() => onPick(obj, index)}
            aria-label={`Explorar ${obj.name}`}
          >
            <span className="fixture-label">{obj.name}</span>
            <span className="interaction-diamond" />
          </Button>
        );
      })}
      <div
        className="room-hero spatial-hero"
        style={{
          left: `${((position.x + 0.5) / 20) * 100}%`,
          top: `${((position.y + 0.5) / 14) * 100}%`,
        }}
      >
        <Hero walking={walking} />
      </div>
    </div>
  );
}
