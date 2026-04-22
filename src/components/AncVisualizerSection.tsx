"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AncVisualizerSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftWavesRef = useRef<HTMLDivElement>(null);
  const rightWavesRef = useRef<HTMLDivElement>(null);

  // Animate the sound waves based on scroll
  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Chaotic waves on the left
      gsap.to(".wave-bar-left", {
        height: () => Math.random() * 80 + 20 + "%",
        duration: 0.15,
        repeat: -1,
        yoyo: true,
        ease: "none",
        stagger: 0.05,
      });

      // Flat lines on the right (Silence)
      // They start slightly chaotic, then flatten out on scroll
      gsap.fromTo(".wave-bar-right", 
        { height: "40%" },
        {
          height: "4px",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "center center",
            scrub: true,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#050505] py-32 border-t border-white/5 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1 relative h-64 md:h-96 w-full rounded-3xl border border-white/10 bg-[#0a0a0a] overflow-hidden flex items-center">
            
            {/* The Glass Barrier */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-cyan-400/50 shadow-[0_0_20px_cyan] z-20">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400/30 text-[0.6rem] uppercase tracking-widest text-cyan-400">
                 Apple ANC
               </div>
            </div>

            {/* Left side: Noise */}
            <div ref={leftWavesRef} className="absolute left-0 top-0 bottom-0 w-1/2 flex items-center justify-evenly px-4 z-10">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={`left-${i}`} className="wave-bar-left w-1 md:w-2 bg-red-500/80 rounded-full" style={{ height: "50%" }} />
              ))}
            </div>

            {/* Right side: Silence */}
            <div ref={rightWavesRef} className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-evenly px-4 z-10">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={`right-${i}`} className="wave-bar-right w-1 md:w-2 bg-cyan-400/80 rounded-full" style={{ height: "40%" }} />
              ))}
            </div>
            
          </div>

          <div className="order-1 lg:order-2">
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-white/40">Active Noise Cancellation</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
              Chaos enters. <br/> Pure silence leaves.
            </h2>
            <p className="text-lg leading-relaxed text-white/60 mb-8">
              By sampling ambient noise 4,000 times per second, the outward-facing microphones detect external sound waves and generate a precise anti-noise signal to cancel them out before they reach your ear.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
