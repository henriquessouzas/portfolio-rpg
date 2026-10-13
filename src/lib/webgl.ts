export function canUseWebGL2(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  const canvas = document.createElement('canvas');

  try {
    const context = canvas.getContext('webgl2');
    return Boolean(context);
  } catch {
    return false;
  }
}

export function canUse3D(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  const forcedMode = params.get('3d');

  if (forcedMode === '0') {
    return false;
  }

  if (forcedMode === '1') {
    return canUseWebGL2();
  }

  if (typeof window.matchMedia === 'function') {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      return false;
    }
  }

  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) {
    return false;
  }

  return canUseWebGL2();
}
