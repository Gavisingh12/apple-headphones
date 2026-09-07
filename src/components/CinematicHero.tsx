"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { loadCachedFrame } from "@/lib/frame-cache";
import { withBasePath } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

const heroConfig = {
  frameCount: 240,
  preloadInitial: 48,
  batchSize: 24,
  maxConcurrentLoads: 4,
  introEndFrame: 45,
  introDuration: 3.5,
  textFadeFrames: 12,
  overscan: 1.1,
  upwardBias: 0.042,
  maxDevicePixelRatio: 1.5,
  frameExtension: "jpg",
} as const;

const frameCacheKey = "hero-sequence";
const frameLookAhead = 18;
const frameLookBehind = 8;

const textCues = [
  { start: 0, end: 85, label: "Immersive Sound" },
  { start: 95, end: 150, label: "Precision Engineered" },
  { start: 165, end: 220, label: "Pure Silence" },
] as const;

type FrameStatus = "idle" | "loading" | "loaded" | "error";

type FrameRecord = {
  image: HTMLImageElement | null;
  promise?: Promise<HTMLImageElement | null>;
  status: FrameStatus;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getFrameUrl = (index: number) =>
  withBasePath(
    `/images/ezgif-frame-${String(index + 1).padStart(3, "0")}.${heroConfig.frameExtension}`,
  );

const getCueOpacity = (frame: number, start: number, end: number) => {
  if (frame < start || frame > end) {
    return 0;
  }

  const fadeFrames = heroConfig.textFadeFrames;
  const fadeInEnd = start + fadeFrames;
  const fadeOutStart = end - fadeFrames;

  if (frame <= fadeInEnd) {
    return clamp((frame - start) / fadeFrames, 0, 1);
  }

  if (frame >= fadeOutStart) {
    return clamp((end - frame) / fadeFrames, 0, 1);
  }

  return 1;
};

export default function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasParallaxRef = useRef<HTMLDivElement>(null);
  const canvasIntroRef = useRef<HTMLDivElement>(null);
  const textParallaxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollTriggerRef = useRef<ReturnType<typeof ScrollTrigger.create> | null>(
    null,
  );
  const introTweenRef = useRef<gsap.core.Tween | null>(null);
  const rafRef = useRef<number | null>(null);
  const requestedFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const initialLoadedCountRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const isAliveRef = useRef(true);
  const framesRef = useRef<FrameRecord[]>(
    Array.from({ length: heroConfig.frameCount }, () => ({
      image: null,
      status: "idle" as FrameStatus,
    })),
  );

  const [currentFrame, setCurrentFrame] = useState(0);
  const [initialLoadRatio, setInitialLoadRatio] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasPaintedFrame, setHasPaintedFrame] = useState(false);

  const firstFrameUrl = getFrameUrl(0);

  const cancelIntro = useCallback((animate = true) => {
    introTweenRef.current?.kill();
    introTweenRef.current = null;

    if (canvasIntroRef.current) {
      if (animate) {
        gsap.to(canvasIntroRef.current, {
          duration: 0.35,
          ease: "power3.out",
          opacity: 1,
          overwrite: "auto",
          scale: 1,
        });
      } else {
        gsap.set(canvasIntroRef.current, { opacity: 1, scale: 1 });
      }
    }
  }, []);

  const getNearestLoadedFrame = useCallback((targetFrame: number) => {
    const frames = framesRef.current;

    if (frames[targetFrame]?.image) {
      return frames[targetFrame].image;
    }

    for (let offset = 1; offset < heroConfig.frameCount; offset += 1) {
      const lowerIndex = targetFrame - offset;
      if (lowerIndex >= 0 && frames[lowerIndex]?.image) {
        return frames[lowerIndex].image;
      }

      const upperIndex = targetFrame + offset;
      if (upperIndex < heroConfig.frameCount && frames[upperIndex]?.image) {
        return frames[upperIndex].image;
      }
    }

    return null;
  }, []);

  const drawFrame = useCallback((targetFrame: number) => {
    const canvas = canvasRef.current;
    const image = getNearestLoadedFrame(targetFrame);

    if (!canvas || !image) {
      return false;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return false;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const devicePixelRatio = Math.min(
      window.devicePixelRatio || 1,
      heroConfig.maxDevicePixelRatio,
    );
    const nextWidth = Math.round(viewportWidth * devicePixelRatio);
    const nextHeight = Math.round(viewportHeight * devicePixelRatio);

    // Keep the backing buffer matched to the viewport and cap DPR for memory safety.
    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }

    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    context.clearRect(0, 0, viewportWidth, viewportHeight);
    context.fillStyle = "#000000";
    context.fillRect(0, 0, viewportWidth, viewportHeight);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    // Slight overscan and upward bias keep the composition immersive and hide the source watermark.
    const scale =
      Math.max(viewportWidth / image.width, viewportHeight / image.height) *
      heroConfig.overscan;
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const drawX = (viewportWidth - drawWidth) / 2;
    const drawY =
      (viewportHeight - drawHeight) / 2 - viewportHeight * heroConfig.upwardBias;

    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    return true;
  }, [getNearestLoadedFrame]);

  const requestDraw = useCallback((frame: number) => {
    requestedFrameRef.current = clamp(frame, 0, heroConfig.frameCount - 1);

    if (rafRef.current !== null) {
      return;
    }

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      const nextFrame = requestedFrameRef.current;
      const didPaint = drawFrame(nextFrame);

      if (didPaint) {
        setHasPaintedFrame((previous) => (previous ? previous : true));
      }

      if (currentFrameRef.current !== nextFrame) {
        currentFrameRef.current = nextFrame;
        setCurrentFrame((previousFrame) =>
          previousFrame === nextFrame ? previousFrame : nextFrame,
        );
      }
    });
  }, [drawFrame]);

  const ensureFrameLoaded = useCallback((index: number) => {
    const frame = framesRef.current[index];

    if (!frame) {
      return Promise.resolve(null);
    }

    if (frame.status === "loaded" && frame.image) {
      return Promise.resolve(frame.image);
    }

    if (frame.promise) {
      return frame.promise;
    }

    frame.status = "loading";
    frame.promise = loadCachedFrame(
      frameCacheKey,
      heroConfig.frameCount,
      index,
      getFrameUrl(index),
      index === 0 ? "high" : "auto",
    ).then((image) => {
      frame.promise = undefined;
      frame.image = image;
      frame.status = image ? "loaded" : "error";

      if (!image || !isAliveRef.current) {
        return image;
      }

      if (index < heroConfig.preloadInitial) {
        initialLoadedCountRef.current += 1;
        setInitialLoadRatio(
          clamp(
            initialLoadedCountRef.current / heroConfig.preloadInitial,
            0,
            1,
          ),
        );
      }

      if (index === 0) {
        requestDraw(0);
      }

      return image;
    });

    return frame.promise;
  }, [requestDraw]);

  const loadFrameIndexes = useCallback(async (indexes: number[]) => {
    const pendingIndexes = indexes.filter(
      (index) => framesRef.current[index]?.status !== "loaded",
    );

    let cursor = 0;
    const workers = Array.from(
      { length: Math.min(heroConfig.maxConcurrentLoads, pendingIndexes.length) },
      async () => {
        while (cursor < pendingIndexes.length) {
          const frameIndex = pendingIndexes[cursor];
          cursor += 1;
          await ensureFrameLoaded(frameIndex);
        }
      },
    );

    await Promise.all(workers);
  }, [ensureFrameLoaded]);

  const loadFrameRange = useCallback((start: number, end: number) =>
    loadFrameIndexes(
      Array.from({ length: Math.max(end - start, 0) }, (_, index) => start + index),
    ), [loadFrameIndexes]);

  const warmFramesNear = useCallback((targetFrame: number) => {
    const indexes = [targetFrame];

    for (let offset = 1; offset <= frameLookAhead; offset += 1) {
      const nextFrame = targetFrame + offset;
      if (nextFrame < heroConfig.frameCount) {
        indexes.push(nextFrame);
      }
    }

    for (let offset = 1; offset <= frameLookBehind; offset += 1) {
      const previousFrame = targetFrame - offset;
      if (previousFrame >= 0) {
        indexes.push(previousFrame);
      }
    }

    void loadFrameIndexes(indexes);
  }, [loadFrameIndexes]);

  useEffect(() => {
    isAliveRef.current = true;

    const loadSequence = async () => {
      // Load the first frame immediately so the canvas paints as quickly as possible.
      void ensureFrameLoaded(0);
      await loadFrameRange(0, heroConfig.preloadInitial);

      if (!isAliveRef.current) {
        return;
      }

      setIsReady(true);

      // Further frames are requested near the current scroll position, not all at once.
      warmFramesNear(heroConfig.introEndFrame);
    };

    void loadSequence();

    return () => {
      isAliveRef.current = false;

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      cancelIntro(false);
    };
  }, [cancelIntro, ensureFrameLoaded, loadFrameRange, warmFramesNear]);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(pointer: fine)");

    const syncMotionPreference = () => {
      reducedMotionRef.current = reducedMotionQuery.matches;
    };

    syncMotionPreference();
    reducedMotionQuery.addEventListener("change", syncMotionPreference);

    const heroElement = heroRef.current;
    const canvasParallaxElement = canvasParallaxRef.current;
    const textParallaxElement = textParallaxRef.current;

    if (!heroElement) {
      return () => {
        reducedMotionQuery.removeEventListener("change", syncMotionPreference);
      };
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotionRef.current || !finePointerQuery.matches) {
        return;
      }

      const bounds = heroElement.getBoundingClientRect();
      const normalizedX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const normalizedY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

      // Move the canvas and the copy separately so the motion feels layered.
      gsap.to(canvasParallaxElement, {
        duration: 0.9,
        ease: "power3.out",
        overwrite: "auto",
        x: normalizedX * 12,
        y: normalizedY * 12,
      });

      gsap.to(textParallaxElement, {
        duration: 0.9,
        ease: "power3.out",
        overwrite: "auto",
        x: normalizedX * 8,
        y: normalizedY * 8,
      });
    };

    const handlePointerLeave = () => {
      gsap.to([canvasParallaxElement, textParallaxElement], {
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
        x: 0,
        y: 0,
      });
    };

    heroElement.addEventListener("pointermove", handlePointerMove);
    heroElement.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      reducedMotionQuery.removeEventListener("change", syncMotionPreference);
      heroElement.removeEventListener("pointermove", handlePointerMove);
      heroElement.removeEventListener("pointerleave", handlePointerLeave);
      gsap.killTweensOf([canvasParallaxElement, textParallaxElement]);
    };
  }, []);

  useLayoutEffect(() => {
    if (!sectionRef.current || !heroRef.current) {
      return undefined;
    }

    const context = gsap.context(() => {
      scrollTriggerRef.current = ScrollTrigger.create({
        anticipatePin: 1,
        end: () =>
          `+=${Math.max(sectionRef.current!.offsetHeight - window.innerHeight, 1)}`,
        invalidateOnRefresh: true,
        onRefresh: () => requestDraw(currentFrameRef.current),
        onUpdate: (self) => {
          if (self.progress > 0) {
            cancelIntro();
          }

          const nextFrame = Math.floor(self.progress * (heroConfig.frameCount - 1));
          warmFramesNear(nextFrame);
          requestDraw(nextFrame);
        },
        pin: heroRef.current,
        pinSpacing: false,
        scrub: 0.35,
        start: "top top",
        trigger: sectionRef.current,
      });
    }, sectionRef);

    const handleResize = () => {
      requestDraw(currentFrameRef.current);
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      scrollTriggerRef.current?.kill();
      scrollTriggerRef.current = null;
      context.revert();
    };
  }, [cancelIntro, requestDraw, warmFramesNear]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (window.scrollY > 4 || reducedMotionRef.current) {
      requestDraw(currentFrameRef.current);
      gsap.set(canvasIntroRef.current, { opacity: 1, scale: 1 });
      ScrollTrigger.refresh();
      return;
    }

    const introPlayhead = { frame: 0 };

    gsap.fromTo(
      canvasIntroRef.current,
      { scale: 1.02 },
      { duration: 1.8, ease: "power3.out", scale: 1 },
    );

    introTweenRef.current = gsap.to(introPlayhead, {
      duration: heroConfig.introDuration,
      ease: "power2.out",
      frame: heroConfig.introEndFrame,
      onUpdate: () => {
        const nextFrame = Math.round(introPlayhead.frame);
        warmFramesNear(nextFrame);
        requestDraw(nextFrame);
      },
      snap: { frame: 1 },
    });

    ScrollTrigger.refresh();
  }, [isReady, requestDraw, warmFramesNear]);

  const loadingPercent = Math.round(initialLoadRatio * 100);
  const scrollHintOpacity = clamp(1 - currentFrame / 18, 0, 1);
  const showLoader = !hasPaintedFrame;

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative h-[420svh] bg-black md:h-[500svh]"
    >
      <div ref={heroRef} className="relative h-[100svh] overflow-hidden bg-black">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(115,115,115,0.18),rgba(0,0,0,0)_38%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0)_18%),linear-gradient(180deg,#040404_0%,#000000_100%)]"
        />

        <div
          ref={canvasParallaxRef}
          className="absolute inset-0 will-change-transform"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
            style={{
              backgroundImage: `url(${firstFrameUrl})`,
              opacity: hasPaintedFrame ? 0 : 1,
              transform: "scale(1.06) translateY(-1.5%)",
            }}
          />
          <div ref={canvasIntroRef} className="absolute inset-0 will-change-transform">
            <canvas
              ref={canvasRef}
              aria-label="Interactive 240-frame headphone animation"
              className="h-full w-full"
            />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-[14vh] left-1/2 h-24 w-[56vw] max-w-4xl -translate-x-1/2 rounded-full bg-black/60 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_34%,rgba(0,0,0,0.22)_58%,rgba(0,0,0,0.82)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-12 -right-12 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.86)_28%,rgba(0,0,0,0)_68%)] blur-2xl md:h-96 md:w-96"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[18vh] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.12)_34%,rgba(0,0,0,0.68)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-14 -right-12 h-52 w-72 rounded-full bg-[radial-gradient(circle_at_bottom_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0.96)_34%,rgba(0,0,0,0.82)_56%,rgba(0,0,0,0)_100%)] blur-2xl md:h-64 md:w-96"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-10 -right-8 h-32 w-44 rounded-full bg-[radial-gradient(circle_at_bottom_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0.98)_36%,rgba(0,0,0,0.84)_62%,rgba(0,0,0,0)_100%)] blur-xl md:h-40 md:w-56"
        />

        <div
          ref={textParallaxRef}
          className="pointer-events-none absolute inset-0 will-change-transform"
        >
          <div className="flex h-full items-center justify-center px-6">
            <div className="relative flex min-h-[16rem] w-full max-w-6xl items-center justify-center text-center">
              {textCues.map((cue) => {
                const opacity = getCueOpacity(currentFrame, cue.start, cue.end);
                const translateY = 22 - opacity * 22;

                return (
                  <div
                    key={cue.label}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      opacity,
                      transform: `translate3d(0, ${translateY}px, 0)`,
                    }}
                  >
                    <div className="max-w-4xl">
                      <p className="mb-4 text-[0.62rem] font-medium uppercase tracking-[0.48em] text-white/40 md:text-xs">
                        Luxury Wireless Audio
                      </p>
                      <h1 className="text-4xl font-medium tracking-[-0.08em] text-white md:text-7xl">
                        {cue.label}
                      </h1>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="absolute inset-x-0 bottom-10 flex justify-center"
            style={{ opacity: scrollHintOpacity }}
          >
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.68rem] uppercase tracking-[0.38em] text-white/55 backdrop-blur-xl">
              Scroll to choreograph the sequence
            </div>
          </div>
        </div>

        <div
          aria-live="polite"
          className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700"
          style={{
            opacity: showLoader ? 1 : 0,
          }}
        >
          <div className="rounded-full border border-white/10 bg-black/30 px-7 py-4 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <p className="mb-3 text-[0.68rem] uppercase tracking-[0.5em] text-white/40">
              Preparing sequence
            </p>
            <p className="text-lg font-medium tracking-[0.18em] text-white/85">
              {loadingPercent}%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
