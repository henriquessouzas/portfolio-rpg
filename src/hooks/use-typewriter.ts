import { useCallback, useEffect, useRef, useState } from 'react';

export function useTypewriter(
  text: string,
  speed: number,
  reducedMotion: boolean,
): { visible: string; done: boolean; skip: () => void } {
  const [index, setIndex] = useState(() => (reducedMotion ? text.length : 0));
  const skipRef = useRef(false);

  // Reset when text or reducedMotion changes
  useEffect(() => {
    skipRef.current = false;
    setIndex(reducedMotion ? text.length : 0);
  }, [text, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || index >= text.length) return;
    const ms = Math.round(1000 / speed);
    const id = setTimeout(() => {
      if (skipRef.current) {
        setIndex(text.length);
      } else {
        setIndex((i) => Math.min(i + 1, text.length));
      }
    }, ms);
    return () => clearTimeout(id);
  }, [index, text, speed, reducedMotion]);

  const skip = useCallback(() => {
    skipRef.current = true;
    setIndex(text.length);
  }, [text.length]);

  return { visible: text.slice(0, index), done: index >= text.length, skip };
}
