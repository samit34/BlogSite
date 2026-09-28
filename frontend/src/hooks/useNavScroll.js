import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Hide the bar on scroll down, show it on scroll up.
 * Uses transform only so layout height never jumps.
 */
export function useNavScroll({ locked = false } = {}) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const lockedRef = useRef(locked);
  lockedRef.current = locked;

  useEffect(() => {
    lastY.current = window.scrollY || 0;

    const update = () => {
      ticking.current = false;
      const y = Math.max(0, window.scrollY || 0);
      const delta = y - lastY.current;
      lastY.current = y;

      if (lockedRef.current || document.querySelector(".offcanvas.show") || y < 12) {
        setHidden(false);
        return;
      }

      if (delta > 4 && y > 40) {
        setHidden(true);
      } else if (delta < -4) {
        setHidden(false);
      }
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (locked) setHidden(false);
  }, [locked]);

  return hidden;
}

export function useElementHeight(ref) {
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const measure = () => {
      setHeight(Math.round(el.getBoundingClientRect().height));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ref]);

  return height;
}
