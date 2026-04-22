"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/site";

type DetailFrameSectionProps = {
  productName: string;
};

const sectionConfig = {
  startFrame: 96,
  endFrame: 180,
  overscan: 1.08,
  upwardBias: 0.028,
  maxDevicePixelRatio: 2,
  frameExtension: "jpg",
} as const;

const detailNotes = [
  {
    eyebrow: "Acoustic Core",
    title: "A tighter frame story works better here.",
    body:
      "Below the overview, a second frame chapter feels more premium than starting a whole new hero. It deepens the page instead of repeating the first impression.",
  },
  {
    eyebrow: "Visual Rhythm",
    title: "Use the same motion language, but narrower.",
    body:
      "This section focuses on a smaller frame range so it reads like a design detail pass, not another full reveal competing with the homepage intro.",
  },
  {
    eyebrow: "Build Story",
    title: `${"AirPods Max"} becomes more believable with layered chapters.`,
    body:
      "Hero for impact, overview for flow, and this lower section for product detail. That sequence is usually stronger than splitting the same assets into separate disconnected pages.",
  },
] as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getFrameUrl = (index: number) =>
  withBasePath(
    `/images/ezgif-frame-${String(index + 1).padStart(3, "0")}.${sectionConfig.frameExtension}`,
  );

export default function DetailFrameSection({
  productName,
}: DetailFrameSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const requestedFrameRef = useRef<number>(sectionConfig.startFrame);
  const currentFrameRef = useRef<number>(sectionConfig.startFrame);
  const framesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const [currentFrame, setCurrentFrame] = useState<number>(sectionConfig.startFrame);
  const [isReady, setIsReady] = useState(false);

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const image = framesRef.current.get(frameIndex);

    if (!canvas || !image) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const viewportWidth = canvas.clientWidth;
    const viewportHeight = canvas.clientHeight;
    const devicePixelRatio = Math.min(
      window.devicePixelRatio || 1,
      sectionConfig.maxDevicePixelRatio,
    );
    const nextWidth = Math.round(viewportWidth * devicePixelRatio);
    const nextHeight = Math.round(viewportHeight * devicePixelRatio);

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }

    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    context.clearRect(0, 0, viewportWidth, viewportHeight);
    context.fillStyle = "#000000";
    context.fillRect(0, 0, viewportWidth, viewportHeight);

    const scale =
      Math.max(viewportWidth / image.width, viewportHeight / image.height) *
      sectionConfig.overscan;
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const drawX = (viewportWidth - drawWidth) / 2;
    const drawY =
      (viewportHeight - drawHeight) / 2 - viewportHeight * sectionConfig.upwardBias;

    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  }, []);

  const requestDraw = useCallback(
    (frameIndex: number) => {
      requestedFrameRef.current = clamp(
        frameIndex,
        sectionConfig.startFrame,
        sectionConfig.endFrame,
      );

      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const nextFrame = requestedFrameRef.current;
        drawFrame(nextFrame);

        if (currentFrameRef.current !== nextFrame) {
          currentFrameRef.current = nextFrame;
          setCurrentFrame(nextFrame);
        }
      });
    },
    [drawFrame],
  );

  useEffect(() => {
    const frameIndexes = Array.from(
      { length: sectionConfig.endFrame - sectionConfig.startFrame + 1 },
      (_, offset) => sectionConfig.startFrame + offset,
    );

    Promise.all(
      frameIndexes.map(
        (index) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.decoding = "async";
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error(`Failed to load frame ${index}`));
            image.src = getFrameUrl(index);
          }),
      ),
    )
      .then((images) => {
        images.forEach((image, offset) => {
          framesRef.current.set(sectionConfig.startFrame + offset, image);
        });

        drawFrame(sectionConfig.startFrame);
        setIsReady(true);
      })
      .catch(() => {
        setIsReady(true);
      });

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [drawFrame]);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElement = sectionRef.current;
      if (!sectionElement) {
        return;
      }

      const rect = sectionElement.getBoundingClientRect();
      const totalScrollable = Math.max(
        sectionElement.offsetHeight - window.innerHeight,
        1,
      );
      const travelled = clamp(-rect.top, 0, totalScrollable);
      const progress = travelled / totalScrollable;
      const frameCount = sectionConfig.endFrame - sectionConfig.startFrame;
      const frameIndex =
        sectionConfig.startFrame + Math.round(progress * frameCount);

      requestDraw(frameIndex);
    };

    const handleResize = () => {
      drawFrame(currentFrameRef.current);
      handleScroll();
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [drawFrame, requestDraw]);

  const noteIndex = clamp(
    Math.floor(
      ((currentFrame - sectionConfig.startFrame) /
        (sectionConfig.endFrame - sectionConfig.startFrame + 1)) *
        detailNotes.length,
    ),
    0,
    detailNotes.length - 1,
  );

  return (
    <section
      ref={sectionRef}
      className="border-t border-white/6 bg-black px-6 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-[0.68rem] uppercase tracking-[0.42em] text-white/35">
            Detail Sequence
          </p>
          <h3 className="text-balance text-3xl font-medium tracking-[-0.05em] text-white md:text-5xl">
            Better below this one, not as a separate hero.
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
            For the homepage, this frame section works best as a lower chapter.
            It extends the story of {productName} instead of stealing attention
            from the main opening animation.
          </p>
        </div>

        <div className="relative h-[220svh]">
          <div className="sticky top-0 grid min-h-[100svh] items-center gap-10 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
            <div className="space-y-5">
              {detailNotes.map((note, index) => {
                const isActive = index === noteIndex;

                return (
                  <article
                    key={note.eyebrow}
                    className={`rounded-[1.6rem] border px-6 py-6 transition duration-500 ${
                      isActive
                        ? "border-white/18 bg-white/[0.06] shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
                        : "border-white/8 bg-white/[0.025]"
                    }`}
                  >
                    <p className="mb-2 text-[0.68rem] uppercase tracking-[0.36em] text-white/35">
                      {note.eyebrow}
                    </p>
                    <h4 className="mb-3 text-2xl font-medium tracking-[-0.04em] text-white md:text-3xl">
                      {note.title}
                    </h4>
                    <p className="text-sm leading-7 text-white/58 md:text-base">
                      {note.body}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[#020202]">
              <div className="aspect-[16/11]">
                <canvas
                  ref={canvasRef}
                  aria-label={`${productName} detail frame sequence`}
                  className="h-full w-full"
                />
              </div>

              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_34%,rgba(0,0,0,0.18)_58%,rgba(0,0,0,0.76)_100%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(0,0,0,0.44),rgba(0,0,0,0))]" />
              <div className="pointer-events-none absolute -bottom-14 -right-14 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.88)_38%,rgba(0,0,0,0)_76%)] blur-xl md:h-64 md:w-64" />

              {!isReady ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-xl">
                  <p className="text-[0.7rem] uppercase tracking-[0.42em] text-white/40">
                    Loading Detail Frames
                  </p>
                </div>
              ) : null}

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/8 bg-black/40 px-5 py-4 backdrop-blur-xl">
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.34em] text-white/35">
                    Current Range
                  </p>
                  <p className="mt-1 text-sm text-white/72">
                    Frames {sectionConfig.startFrame + 1} to {sectionConfig.endFrame + 1}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[0.62rem] uppercase tracking-[0.34em] text-white/35">
                    Suggested Placement
                  </p>
                  <p className="mt-1 text-sm text-white/72">Below the overview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
