/** Caminhos dos modelos GLB do castelo (arquivos em public/models/castle-3d/). */
const modelUrl = (file: string) => `${import.meta.env.BASE_URL}models/castle-3d/${file}.glb`;

export const wall = { url: modelUrl('wall') };
export const doorway = { url: modelUrl('wall-doorway') };
export const gate = { url: modelUrl('gate') };
export const base = { url: modelUrl('tower-hexagon-base') };
export const mid = { url: modelUrl('tower-hexagon-mid') };
export const roof = { url: modelUrl('tower-hexagon-roof') };
export const keepBase = { url: modelUrl('tower-square-base') };
export const keepMid = { url: modelUrl('tower-square-mid-windows') };
export const keepRoof = { url: modelUrl('tower-square-top-roof-high') };
export const tree = { url: modelUrl('tree-large') };
export const rock = { url: modelUrl('rocks-large') };
