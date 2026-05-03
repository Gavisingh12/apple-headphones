"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getFrameLoadProfile, scheduleIdleTask } from "@/lib/performance";
import { withBasePath } from "@/lib/site";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const techConfig = {
  frameCount: 240, // Updated to use the full 240 frames provided by the user
  overscan: 1.05,
  upwardBias: 0,
  frameExtension: "jpg",
  framePrefix: "frame-", // e.g., frame-001.jpg
  frameFolder: withBasePath("/driver-frames"),
} as const;

const textCues = [
  { start: 10, end: 80, title: "Custom Acoustic Core", desc: "Engineered from the ground up for zero distortion." },
  { start: 90, end: 160, title: "Dual Neodymium Motors", desc: "Unprecedented magnetic density for instant transient response." },
  { start: 170, end: 235, title: "Precision Voice Coil", desc: "Ultra-lightweight copper-clad aluminum wire." },
] as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getFrameUrl = (index: number) =>
  `${techConfig.frameFolder}/${techConfig.framePrefix}${String(index + 1).padStart(3, "0")}.${techConfig.frameExtension}`;

const getCueOpacity = (frame: number, start: number, end: number) => {
  if (frame < start || frame > end) return 0;
  const fadeFrames = 8;
  if (frame <= start + fadeFrames) return clamp((frame - start) / fadeFrames, 0, 1);
  if (frame >= end - fadeFrames) return clamp((end - frame) / fadeFrames, 0, 1);
  return 1;
};

export default function TechnologySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollTriggerRef = useRef<ReturnType<typeof ScrollTrigger.create> | null>(null);
  const rafRef = useRef<number | null>(null);
  const introTweenRef = useRef<gsap.core.Tween | null>(null);
  const cancelIdleLoadRef = useRef<(() => void) | null>(null);
  const loadProfileRef = useRef(getFrameLoadProfile());
  const requestedFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const isAliveRef = useRef(true);
  const framesRef = useRef<(HTMLImageElement | null)[]>(
    Array.from({ length: techConfig.frameCount }, () => null)
  );

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasPaintedFrame, setHasPaintedFrame] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const loadProfile = loadProfileRef.current;

  const drawFrame = useCallback((targetFrame: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    // Find nearest loaded frame
    let image = framesRef.current[targetFrame];
    if (!image) {
      for (let offset = 1; offset < techConfig.frameCount; offset++) {
        if (targetFrame - offset >= 0 && framesRef.current[targetFrame - offset]) {
          image = framesRef.current[targetFrame - offset];
          break;
        }
        if (targetFrame + offset < techConfig.frameCount && framesRef.current[targetFrame + offset]) {
          image = framesRef.current[targetFrame + offset];
          break;
        }
      }
    }

    if (!image) return false;

    const context = canvas.getContext("2d");
    if (!context) return false;

    const viewportWidth = canvas.clientWidth;
    const viewportHeight = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, loadProfile.maxDevicePixelRatio);
    const nextWidth = Math.round(viewportWidth * dpr);
    const nextHeight = Math.round(viewportHeight * dpr);

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, viewportWidth, viewportHeight);
    
    // Transparent background so we can layer it over CSS gradients
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    const scale = Math.min(viewportWidth / image.width, viewportHeight / image.height) * 1.0;
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const drawX = (viewportWidth - drawWidth) / 2;
    const drawY = (viewportHeight - drawHeight) / 2;

    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    
    if (!hasPaintedFrame) {
      setHasPaintedFrame(true);
    }
    return true;
  }, [hasPaintedFrame, loadProfile.maxDevicePixelRatio]);

  const requestDraw = useCallback((frame: number) => {
    requestedFrameRef.current = clamp(frame, 0, techConfig.frameCount - 1);
    if (rafRef.current !== null) return;

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      const nextFrame = requestedFrameRef.current;
      drawFrame(nextFrame);

      if (currentFrameRef.current !== nextFrame) {
        currentFrameRef.current = nextFrame;
        setCurrentFrame(nextFrame);
      }
    });
  }, [drawFrame]);

  // Load frames dynamically
  useEffect(() => {
    isAliveRef.current = true;
    
    const loadFrame = (index: number): Promise<void> => {
      if (framesRef.current[index]) return Promise.resolve();
      return new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (isAliveRef.current) {
            framesRef.current[index] = img;
            if (index === 0) requestDraw(0);
          }
          resolve();
        };
        img.onerror = () => resolve(); // Gracefully handle missing frames
        img.src = getFrameUrl(index);
      });
    };

    const loadSequence = async () => {
      // Load a smaller initial batch so the page becomes interactive sooner.
      const initialBatch = Array.from(
        { length: Math.min(loadProfile.preloadInitial, techConfig.frameCount) },
        (_, i) => loadFrame(i),
      );
      await Promise.all(initialBatch);
      if (!isAliveRef.current) return;
      setIsReady(true);

      const queueRemainingFrames = (start: number) => {
        if (!isAliveRef.current || start >= techConfig.frameCount) {
          return;
        }

        cancelIdleLoadRef.current = scheduleIdleTask(async () => {
          const batch = Array.from(
            { length: Math.min(loadProfile.batchSize, techConfig.frameCount - start) },
            (_, offset) => loadFrame(start + offset),
          );
          await Promise.all(batch);

          if (!isAliveRef.current) {
            return;
          }

          queueRemainingFrames(start + loadProfile.batchSize);
        });
      };

      // Lazy load the rest in the background once the page has painted.
      queueRemainingFrames(loadProfile.preloadInitial);
    };

    void loadSequence();

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", motionListener);

    return () => {
      isAliveRef.current = false;
      cancelIdleLoadRef.current?.();
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      motionQuery.removeEventListener("change", motionListener);
    };
  }, [loadProfile.batchSize, loadProfile.preloadInitial, requestDraw]);

  useLayoutEffect(() => {
    if (!sectionRef.current || !containerRef.current || reducedMotion || !isReady) return;

    const ctx = gsap.context(() => {
      // Cinematic Intro Transition starts immediately on load
      const introPlayhead = { frame: 0 };
      introTweenRef.current = gsap.to(introPlayhead, {
        duration: 3,
        ease: "power2.inOut",
        frame: 45, // Smoothly animate first 45 frames automatically
        onUpdate: () => requestDraw(Math.round(introPlayhead.frame)),
        snap: { frame: 1 },
      });

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=400%", // 4 screens of scrolling for the 240 frame sequence
        pin: containerRef.current,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (introTweenRef.current?.isActive()) {
            introTweenRef.current.kill(); // Kill intro if user scrubs manually
          }
          // Start the manual scrub from frame 45 (where intro left off) if we are near the top, 
          // or just map normally so it seamlessly takes over
          const nextFrame = Math.max(
            Math.round(introPlayhead.frame), 
            Math.floor(self.progress * (techConfig.frameCount - 1))
          );
          requestDraw(nextFrame);
        },
      });
    }, sectionRef);

    return () => {
      scrollTriggerRef.current?.kill();
      introTweenRef.current?.kill();
      ctx.revert();
    };
  }, [reducedMotion, requestDraw, isReady]);

  return (
    <section ref={sectionRef} className="relative bg-black text-white">
      {/* Scrollable height container */}
      <div className="h-[300svh]" />

      {/* Pinned container */}
      <div ref={containerRef} className="absolute top-0 left-0 w-full h-[100svh] overflow-hidden bg-black">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,20,20,0.5),rgba(0,0,0,1)_75%)]" />

        {/* Canvas for the driver frames */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out"
          style={{ opacity: hasPaintedFrame ? 1 : 0 }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain mix-blend-screen"
            aria-label="Acoustic driver teardown animation"
          />
        </div>

        {/* Dynamic Text Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none flex items-center transition-opacity duration-1000"
          style={{ opacity: hasPaintedFrame ? 1 : 0 }}
        >
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
            
            {/* Left aligned text blocks */}
            <div className="flex-1 relative h-64">
              {textCues.map((cue) => {
                const opacity = getCueOpacity(currentFrame, cue.start, cue.end);
                const translateY = 20 - opacity * 20;
                
                return (
                  <div
                    key={cue.title}
                    className="absolute top-1/2 -translate-y-1/2 left-0 max-w-sm"
                    style={{
                      opacity,
                      transform: `translate3d(0, ${translateY}px, 0)`,
                      transition: "opacity 0.1s ease-out, transform 0.1s ease-out",
                    }}
                  >
                    <h3 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white drop-shadow-2xl">
                      {cue.title}
                    </h3>
                    <p className="text-lg text-white/60 drop-shadow-xl">
                      {cue.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Loading Indicator */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-500">
             <p className="text-sm uppercase tracking-[0.3em] text-white/50 animate-pulse">
                Initializing Acoustic Engine...
             </p>
          </div>
        )}
      </div>
    </section>
  );
}
