'use client';

import { useEffect, useState } from 'react';

export type PresenceState = 'entering' | 'entered' | 'exiting' | 'exited';

interface PresenceSnapshot {
  sourceVisible: boolean;
  shouldRender: boolean;
  state: PresenceState;
}

/** Keeps content mounted long enough for both entry and exit transitions. */
export function usePresence(isVisible: boolean, duration = 260) {
  const [presence, setPresence] = useState<PresenceSnapshot>(() => ({
    sourceVisible: isVisible,
    shouldRender: isVisible,
    state: isVisible ? 'entering' : 'exited',
  }));

  if (isVisible !== presence.sourceVisible) {
    setPresence({
      sourceVisible: isVisible,
      shouldRender: isVisible || presence.shouldRender,
      state: isVisible ? 'entering' : 'exiting',
    });
  }

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;

    if (presence.state === 'entering') {
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          setPresence((current) =>
            current.state === 'entering'
              ? { ...current, state: 'entered' }
              : current,
          );
        });
      });
    } else if (presence.state === 'exiting') {
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      exitTimer = setTimeout(() => {
        setPresence((current) =>
          current.state === 'exiting'
            ? { ...current, shouldRender: false, state: 'exited' }
            : current,
        );
      }, reduceMotion ? 0 : duration);
    }

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, [duration, presence.state]);

  return {
    shouldRender: presence.shouldRender,
    state: presence.state,
  };
}
