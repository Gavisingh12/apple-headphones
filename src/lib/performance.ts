type ExtendedNavigator = Navigator & {
  connection?: {
    saveData?: boolean;
  };
  deviceMemory?: number;
};

type IdleWindow = Window & typeof globalThis & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout?: number },
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export type FrameLoadProfile = {
  preloadInitial: number;
  batchSize: number;
  maxConcurrentLoads: number;
  maxDevicePixelRatio: number;
};

export const getFrameLoadProfile = (): FrameLoadProfile => {
  if (typeof window === "undefined") {
    return {
      preloadInitial: 16,
      batchSize: 12,
      maxConcurrentLoads: 3,
      maxDevicePixelRatio: 1.5,
    };
  }

  const navigatorInfo = navigator as ExtendedNavigator;
  const saveData = navigatorInfo.connection?.saveData ?? false;
  const memory = navigatorInfo.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const constrained = saveData || coarsePointer || memory <= 4 || cores <= 6;

  if (constrained) {
    return {
      preloadInitial: 8,
      batchSize: 8,
      maxConcurrentLoads: 2,
      maxDevicePixelRatio: 1.25,
    };
  }

  return {
    preloadInitial: 16,
    batchSize: 12,
    maxConcurrentLoads: 3,
    maxDevicePixelRatio: 1.5,
  };
};

export const scheduleIdleTask = (
  callback: () => void,
  delay = 120,
): (() => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const idleWindow = window as IdleWindow;

  if (idleWindow.requestIdleCallback) {
    const handle = idleWindow.requestIdleCallback(callback, { timeout: 500 });
    return () => idleWindow.cancelIdleCallback?.(handle);
  }

  const handle = window.setTimeout(callback, delay);
  return () => window.clearTimeout(handle);
};
