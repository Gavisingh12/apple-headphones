"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { withBasePath } from "@/lib/site";

export default function AudioChipSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !chipRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        }
      });

      // Scale chip up slightly
      tl.fromTo(chipRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 })
        // Pulse the background glow
        .fromTo(glowRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1.2, duration: 1 }, "<")
        // Animate text fading in and sliding up
        .fromTo(textRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.5");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden bg-[#020202] py-40">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        
        <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-center">
          
          {/* Glowing Background Ring */}
          <div 
            ref={glowRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,255,255,0.15)_0%,rgba(0,0,0,0)_70%)] blur-3xl"
          />

          {/* Chip Image Container */}
          <div className="relative z-10 w-full max-w-[500px] aspect-square flex items-center justify-center perspective-[1000px]">
             {/* We will use the generated image here. For now, a fallback CSS representation if image fails */}
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-3xl border border-white/10 shadow-[0_0_100px_rgba(0,255,255,0.1)] overflow-hidden">
                <Image
                  ref={chipRef}
                  src={withBasePath("/images/audio_processing_chip.png")}
                  alt="Apple Bionic Audio Engine"
                  fill
                  className="object-cover mix-blend-screen"
                />
             </div>
             
             {/* Data Lines overlay */}
             <div ref={linesRef} className="absolute inset-0 pointer-events-none opacity-50">
               {/* Horizontal glowing lines */}
               <div className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_cyan]" />
               <div className="absolute top-2/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_cyan]" />
               {/* Vertical glowing lines */}
               <div className="absolute left-1/3 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_cyan]" />
               <div className="absolute left-2/3 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_cyan]" />
             </div>
          </div>

          <div ref={textRef} className="relative z-20 mt-20 text-center max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-cyan-400/80">Bionic Audio Engine</p>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6">
              The brain behind the silence.
            </h2>
            <p className="text-lg leading-relaxed text-white/60">
              Our custom silicon processes audio at 50,000 operations per second. It constantly analyzes your environment, continuously adapting the noise cancellation algorithms to eliminate chaotic frequencies before you even perceive them.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
