"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/site";

type OverviewLoopSectionProps = {
  productName: string;
};

const loopConfig = {
  startFrame: 0,
  endFrame: 95,
  fps: 18,
  frameExtension: "jpg",
  overscan: 1.08,
  upwardBias: 0.025,
  maxDevicePixelRatio: 2,
} as const;

const getFrameUrl = (index: number) =>
  withBasePath(
    `/images/ezgif-frame-${String(index + 1).padStart(3, "0")}.${loopConfig.frameExtension}`,
  );

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

// Shared canvas paint helper keeps the section stable and avoids per-render hook churn.
const paintOverviewFrame = (
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
) => {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const viewportWidth = canvas.clientWidth;
  const viewportHeight = canvas.clientHeight;
  const devicePixelRatio = Math.min(
    window.devicePixelRatio || 1,
    loopConfig.maxDevicePixelRatio,
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
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const scale =
    Math.max(viewportWidth / image.width, viewportHeight / image.height) *
    loopConfig.overscan;
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drawX = (viewportWidth - drawWidth) / 2;
  const drawY =
    (viewportHeight - drawHeight) / 2 - viewportHeight * loopConfig.upwardBias;

  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
};

export default function OverviewLoopSection({
  productName,
}: OverviewLoopSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const currentIndexRef = useRef(0);
  const directionRef = useRef(1);
  const visibleRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncMotionPreference = () => {
      reducedMotionRef.current = reducedMotionQuery.matches;
    };

    syncMotionPreference();
    reducedMotionQuery.addEventListener("change", syncMotionPreference);

    const frameIndexes = Array.from(
      { length: loopConfig.endFrame - loopConfig.startFrame + 1 },
      (_, offset) => loopConfig.startFrame + offset,
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
        if (!isMounted) {
          return;
        }

        framesRef.current = images;
        currentIndexRef.current = 0;

        if (canvasRef.current && images[0]) {
          paintOverviewFrame(canvasRef.current, images[0]);
        }

        setIsReady(true);
      })
      .catch(() => {
        if (isMounted) {
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
      reducedMotionQuery.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.25 },
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const image = framesRef.current[currentIndexRef.current];

      if (canvas && image) {
        paintOverviewFrame(canvas, image);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const animate = (time: number) => {
      const canvas = canvasRef.current;
      const frames = framesRef.current;

      if (!canvas || frames.length === 0) {
        rafRef.current = window.requestAnimationFrame(animate);
        return;
      }

      if (reducedMotionRef.current) {
        if (currentIndexRef.current !== 0) {
          currentIndexRef.current = 0;
        }

        paintOverviewFrame(canvas, frames[0]);
        rafRef.current = window.requestAnimationFrame(animate);
        return;
      }

      if (visibleRef.current) {
        const frameInterval = 1000 / loopConfig.fps;

        if (time - lastFrameTimeRef.current >= frameInterval) {
          lastFrameTimeRef.current = time;

          const lastIndex = frames.length - 1;
          const nextIndex = currentIndexRef.current + directionRef.current;

          if (nextIndex >= lastIndex || nextIndex <= 0) {
            directionRef.current *= -1;
          }

          currentIndexRef.current = clamp(
            currentIndexRef.current + directionRef.current,
            0,
            lastIndex,
          );

          paintOverviewFrame(canvas, frames[currentIndexRef.current]);
        }
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-t border-white/6 bg-black px-6 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-[0.68rem] uppercase tracking-[0.42em] text-white/35">
              Overview Sequence
            </p>
            <h3 className="text-3xl font-medium tracking-[-0.05em] text-white md:text-5xl">
              A frame-driven product overview section.
            </h3>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/55 md:text-base">
            A slower motion panel placed under the homepage feature blocks so the
            product story keeps moving instead of stopping after the hero.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative overflow-hidden rounded-[1.9rem] border border-white/8 bg-[#020202]">
            <div className="aspect-[16/10]">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${getFrameUrl(loopConfig.startFrame)})`,
                  transform: "scale(1.08) translateY(-2%)",
                }}
              />
              <canvas
                ref={canvasRef}
                aria-label={`${productName} overview animation`}
                className="relative h-full w-full"
              />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_36%,rgba(0,0,0,0.16)_60%,rgba(0,0,0,0.72)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(0,0,0,0.5),rgba(0,0,0,0))]" />
            <div className="pointer-events-none absolute -bottom-14 -right-14 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.88)_38%,rgba(0,0,0,0)_75%)] blur-xl md:h-64 md:w-64" />

            {!isReady ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/72 backdrop-blur-xl">
                <p className="text-[0.7rem] uppercase tracking-[0.42em] text-white/40">
                  Loading Overview
                </p>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-6">
              <p className="mb-2 text-[0.68rem] uppercase tracking-[0.35em] text-white/35">
                Section Purpose
              </p>
              <p className="text-sm leading-7 text-white/60 md:text-base">
                This is better below the main hero than as a separate opening.
                The first section wins attention, and this one extends the story.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-6">
              <p className="mb-2 text-[0.68rem] uppercase tracking-[0.35em] text-white/35">
                Motion Language
              </p>
              <p className="text-sm leading-7 text-white/60 md:text-base">
                The loop uses the same studio-lit framing and frame-by-frame
                precision as the hero, but at a calmer pace for the lower page.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-6">
              <p className="mb-2 text-[0.68rem] uppercase tracking-[0.35em] text-white/35">
                Expansion Ready
              </p>
              <p className="text-sm leading-7 text-white/60 md:text-base">
                The section is ready for more stills, more copy, or another frame
                block when you want to extend the overview chapter later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
