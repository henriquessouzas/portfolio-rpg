import { useEffect, useRef } from 'react';
import castleImage from '@/assets/castle.jpg';

// Localized texture displacement: masonry stays still, foliage and cloth move.
const fragment = `precision mediump float;
uniform sampler2D scene;
uniform float time;
varying vec2 uv;
float patch(vec2 p,vec2 c,vec2 radius){return 1.0-smoothstep(0.55,1.0,length((p-c)/radius));}
float cloth(vec2 p,vec2 c,vec2 radius){vec2 q=abs((p-c)/radius);return (1.0-smoothstep(.8,1.0,q.x))*(1.0-smoothstep(.85,1.0,q.y))*smoothstep(c.y-radius.y,c.y+radius.y,p.y);}
void main(){
 vec2 p=uv;
 float foliage=patch(p,vec2(.06,.47),vec2(.16,.33))+patch(p,vec2(.96,.46),vec2(.14,.36));
 foliage+=patch(p,vec2(.14,.87),vec2(.20,.15))+patch(p,vec2(.85,.88),vec2(.22,.14));
  float flags=cloth(p,vec2(.325,.088),vec2(.029,.027))+cloth(p,vec2(.54,.033),vec2(.025,.018));
  flags+=cloth(p,vec2(.737,.085),vec2(.032,.023))+cloth(p,vec2(.425,.145),vec2(.014,.013));
  flags+=cloth(p,vec2(.604,.144),vec2(.013,.012));
  flags+=cloth(p,vec2(.376,.487),vec2(.014,.052))+cloth(p,vec2(.501,.42),vec2(.020,.055))+cloth(p,vec2(.631,.487),vec2(.014,.052));
  flags+=cloth(p,vec2(.314,.786),vec2(.020,.070))+cloth(p,vec2(.686,.786),vec2(.020,.070));
 float breeze=sin(time*1.8+p.y*29.0)+.4*sin(time*3.1+p.x*45.0);
  p.x+=min(foliage,1.0)*breeze*.0023;
 p.y+=min(foliage,1.0)*sin(time*2.0+p.x*31.0)*.0009;
  p.x+=min(flags,1.0)*sin(time*3.5+p.y*105.0)*.0045;
 p.y+=min(flags,1.0)*cos(time*3.5+p.x*95.0)*.0015;
 gl_FragColor=texture2D(scene,p);
}`;

export function WindScene({ reducedMotion }: { reducedMotion: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element || reducedMotion) return;
    const gl = element.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return;
    let frame = 0,
      cancelled = false;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };
    const vertex = compile(
      gl.VERTEX_SHADER,
      'attribute vec2 position;varying vec2 uv;void main(){uv=vec2((position.x+1.0)/2.0,(1.0-position.y)/2.0);gl_Position=vec4(position,0.0,1.0);}',
    );
    const frag = compile(gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    if (!vertex || !frag || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const hideCanvas = () => {
      delete element.dataset['ready'];
      cancelAnimationFrame(frame);
    };
    element.addEventListener('webglcontextlost', hideCanvas);
    const image = new Image();
    image.onload = () => {
      if (cancelled) return;
      element.width = image.naturalWidth;
      element.height = image.naturalHeight;
      gl.viewport(0, 0, element.width, element.height);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      const time = gl.getUniformLocation(program, 'time');
      const draw = (now: number) => {
        if (cancelled) return;
        gl.uniform1f(time, now / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        element.dataset['ready'] = 'true';
        frame = requestAnimationFrame(draw);
      };
      frame = requestAnimationFrame(draw);
    };
    image.src = castleImage;
    return () => {
      cancelled = true;
      image.onload = null;
      element.removeEventListener('webglcontextlost', hideCanvas);
      cancelAnimationFrame(frame);
      delete element.dataset['ready'];
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(frag);
    };
  }, [reducedMotion]);
  return (
    <span className="wind-scene">
      <img
        src={castleImage}
        alt="Castelo de pedra com torres vermelhas, cercado por montanhas e um fosso azul"
        width="1536"
        height="1024"
        fetchPriority="high"
      />
      <canvas ref={canvas} aria-hidden="true" className="wind-canvas" />
    </span>
  );
}
