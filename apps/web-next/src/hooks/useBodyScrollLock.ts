'use client';

import { useEffect, useRef } from 'react';

type InlineProperty = {
  value: string;
  priority: string;
};

type BodyLockSnapshot = {
  bodyPosition: InlineProperty;
  bodyTop: InlineProperty;
  bodyWidth: InlineProperty;
  bodyOverflow: InlineProperty;
  rootScrollBehavior: InlineProperty;
  scrollX: number;
  scrollY: number;
};

const activeLocks = new Set<symbol>();
let lockSnapshot: BodyLockSnapshot | null = null;
let restoreSnapshotScroll = true;

function readProperty(style: CSSStyleDeclaration, property: string): InlineProperty {
  return {
    value: style.getPropertyValue(property),
    priority: style.getPropertyPriority(property),
  };
}

function restoreProperty(
  style: CSSStyleDeclaration,
  property: string,
  snapshot: InlineProperty,
) {
  if (snapshot.value) {
    style.setProperty(property, snapshot.value, snapshot.priority);
  } else {
    style.removeProperty(property);
  }
}

function acquireBodyLock(token: symbol) {
  if (activeLocks.has(token)) return;

  if (activeLocks.size === 0) {
    const bodyStyle = document.body.style;
    const rootStyle = document.documentElement.style;

    lockSnapshot = {
      bodyPosition: readProperty(bodyStyle, 'position'),
      bodyTop: readProperty(bodyStyle, 'top'),
      bodyWidth: readProperty(bodyStyle, 'width'),
      bodyOverflow: readProperty(bodyStyle, 'overflow'),
      rootScrollBehavior: readProperty(rootStyle, 'scroll-behavior'),
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    };
    restoreSnapshotScroll = true;

    bodyStyle.setProperty('position', 'fixed');
    bodyStyle.setProperty('top', `-${lockSnapshot.scrollY}px`);
    bodyStyle.setProperty('width', '100%');
    bodyStyle.setProperty('overflow', 'hidden');
  }

  activeLocks.add(token);
}

function releaseBodyLock(token: symbol, restoreScroll: boolean) {
  if (!activeLocks.has(token)) return;
  activeLocks.delete(token);
  if (!restoreScroll) restoreSnapshotScroll = false;
  if (activeLocks.size > 0 || !lockSnapshot) return;

  const snapshot = lockSnapshot;
  lockSnapshot = null;
  const bodyStyle = document.body.style;
  const rootStyle = document.documentElement.style;

  restoreProperty(bodyStyle, 'position', snapshot.bodyPosition);
  restoreProperty(bodyStyle, 'top', snapshot.bodyTop);
  restoreProperty(bodyStyle, 'width', snapshot.bodyWidth);
  restoreProperty(bodyStyle, 'overflow', snapshot.bodyOverflow);

  if (restoreSnapshotScroll) {
    rootStyle.setProperty('scroll-behavior', 'auto');
    window.scrollTo(snapshot.scrollX, snapshot.scrollY);
    restoreProperty(rootStyle, 'scroll-behavior', snapshot.rootScrollBehavior);
  }
  restoreSnapshotScroll = true;
}

/**
 * Locks page scrolling while at least one overlay owns a lock. The first owner captures
 * the page state and the last owner restores it, so nested overlays cannot unlock each
 * other or lose the original scroll position.
 */
export function useBodyScrollLock(
  isLocked: boolean,
  { restoreScroll = true }: { restoreScroll?: boolean } = {},
) {
  const tokenRef = useRef(Symbol('body-scroll-lock'));
  const restoreScrollRef = useRef(restoreScroll);

  useEffect(() => {
    restoreScrollRef.current = restoreScroll;
  }, [restoreScroll]);

  useEffect(() => {
    if (!isLocked) return;

    const token = tokenRef.current;
    acquireBodyLock(token);
    return () => releaseBodyLock(token, restoreScrollRef.current);
  }, [isLocked]);
}
