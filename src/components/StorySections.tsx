"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

function Section({
  scrollYProgress,
  start,
  end,
  children,
  align = "center",
}: {
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}) {
  const t1 = Math.max(0, start - 0.05);
  const t2 = Math.max(t1, start);
  const t3 = Math.max(t2, end - 0.05);
  const t4 = Math.max(t3, end);

  const opacityInput = start === 0 ? [t3, t4] : [t1, t2, t3, t4];
  const opacityOutput = start === 0 ? [1, 0] : [0, 1, 1, 0];
  const opacity = useTransform(scrollYProgress, opacityInput, opacityOutput);
  
  const yInput = start === 0 ? [t3, t4] : [t1, t2, t3, t4];
  const yOutput = start === 0 ? [0, -50] : [50, 0, 0, -50];
  const y = useTransform(scrollYProgress, yInput, yOutput);

  const alignClass =
    align === "left"
      ? "items-start text-left ml-12 md:ml-32"
      : align === "right"
      ? "items-end text-right mr-12 md:mr-32"
      : "items-center text-center mx-auto";

  return (
    <motion.div
      style={{ opacity, y }}
      className={`fixed inset-0 flex flex-col justify-center pointer-events-none ${alignClass} w-full max-w-7xl mx-auto`}
    >
      <div className="pointer-events-auto">{children}</div>
    </motion.div>
  );
}

export default function StorySections() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative w-full h-[400vh]">
      <Section scrollYProgress={scrollYProgress} start={0} end={0.15} align="center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4">
          AirPods Max
        </h1>
        <p className="text-xl md:text-2xl text-white/80 font-medium tracking-tight">
          Computational audio. Key to the finest listening experience.
        </p>
      </Section>

      <Section scrollYProgress={scrollYProgress} start={0.2} end={0.35} align="left">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-6 max-w-xl">
          A radically original composition.
        </h2>
        <div className="space-y-4 text-lg md:text-xl text-white/60 max-w-md font-medium">
          <p>The over-ear headphone has been completely reimagined.</p>
          <p>From cushion to canopy, AirPods Max are designed for an uncompromising fit.</p>
        </div>
      </Section>

      <Section scrollYProgress={scrollYProgress} start={0.4} end={0.6} align="right">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 max-w-xl ml-auto">
          Industry-leading Active Noise Cancellation.
        </h2>
        <div className="space-y-4 text-lg md:text-xl text-white/60 max-w-md ml-auto font-medium">
          <p>Multi-microphone array listens in every direction.</p>
          <p>Computational audio adapts to your exact fit and seal in real time.</p>
          <p>Your music stays pure. The world fades away.</p>
        </div>
      </Section>

      <Section scrollYProgress={scrollYProgress} start={0.65} end={0.8} align="left">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 max-w-xl">
          High-fidelity audio.
        </h2>
        <div className="space-y-4 text-lg md:text-xl text-white/60 max-w-md font-medium">
          <p>Custom-built driver delivers ultra-low distortion across the audible range.</p>
          <p>Hear every note with a new sense of clarity and texture.</p>
        </div>
      </Section>

      <Section scrollYProgress={scrollYProgress} start={0.85} end={1} align="center">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4">
          Hear everything. Feel nothing else.
        </h2>
        <p className="text-xl md:text-2xl text-white/60 font-medium tracking-tight mb-8">
          AirPods Max. Designed for focus.
        </p>
        <button className="px-8 py-3 text-lg font-medium text-white bg-[#0050FF]/10 border border-[#0050FF]/40 rounded-full hover:bg-[#0050FF]/20 hover:border-[#00D6FF]/60 hover:shadow-[0_0_20px_rgba(0,214,255,0.3)] transition-all duration-300">
          Experience AirPods Max
        </button>
      </Section>
    </div>
  );
}
