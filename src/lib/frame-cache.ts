type FrameCacheEntry = {
  image: HTMLImageElement | null;
  lastUsed: number;
  promise?: Promise<HTMLImageElement | null>;
};

const frameCaches = new Map<string, FrameCacheEntry[]>();
const maxCachedFramesPerSequence = 96;

const getSequenceCache = (sequence: string, frameCount: number) => {
  let cache = frameCaches.get(sequence);

  if (!cache) {
    cache = Array.from({ length: frameCount }, () => ({
      image: null,
      lastUsed: 0,
    }));
    frameCaches.set(sequence, cache);
  }

  return cache;
};

const trimSequenceCache = (cache: FrameCacheEntry[]) => {
  const loaded = cache.filter((entry) => entry.image);

  if (loaded.length <= maxCachedFramesPerSequence) {
    return;
  }

  loaded
    .sort((a, b) => a.lastUsed - b.lastUsed)
    .slice(0, loaded.length - maxCachedFramesPerSequence)
    .forEach((entry) => {
      entry.image = null;
    });
};

export const loadCachedFrame = (
  sequence: string,
  frameCount: number,
  index: number,
  url: string,
  priority: "high" | "auto" = "auto",
) => {
  const cache = getSequenceCache(sequence, frameCount);
  const entry = cache[index];

  if (!entry) {
    return Promise.resolve(null);
  }

  if (entry.image) {
    entry.lastUsed = Date.now();
    return Promise.resolve(entry.image);
  }

  if (entry.promise) {
    return entry.promise;
  }

  entry.promise = new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = priority;

    image.onload = async () => {
      // Keep recently used decoded images in memory so scroll scrubbing does not decode them again.
      try {
        await image.decode();
      } catch {
        // Some browsers reject decode() after a successful load; the image remains usable.
      }

      entry.image = image;
      entry.lastUsed = Date.now();
      entry.promise = undefined;
      trimSequenceCache(cache);
      resolve(image);
    };

    image.onerror = () => {
      entry.promise = undefined;
      resolve(null);
    };

    image.src = url;
  });

  return entry.promise;
};
