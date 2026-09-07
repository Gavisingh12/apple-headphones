type FrameCacheEntry = {
  image: HTMLImageElement | null;
  promise?: Promise<HTMLImageElement | null>;
};

const frameCaches = new Map<string, FrameCacheEntry[]>();

const getSequenceCache = (sequence: string, frameCount: number) => {
  let cache = frameCaches.get(sequence);

  if (!cache) {
    cache = Array.from({ length: frameCount }, () => ({ image: null }));
    frameCaches.set(sequence, cache);
  }

  return cache;
};

export const loadCachedFrame = (
  sequence: string,
  frameCount: number,
  index: number,
  url: string,
  priority: "high" | "auto" = "auto",
) => {
  const entry = getSequenceCache(sequence, frameCount)[index];

  if (!entry) {
    return Promise.resolve(null);
  }

  if (entry.image) {
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
      // Keep fully decoded images in memory so scroll scrubbing does not decode them again.
      try {
        await image.decode();
      } catch {
        // Some browsers reject decode() after a successful load; the image remains usable.
      }

      entry.image = image;
      entry.promise = undefined;
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
