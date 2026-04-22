"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SpatialAudioSection() {
  const ringsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ringsRef.current) return;
    const ctx = gsap.context(() => {
      // Rotate the entire ring container slowly
      gsap.to(ringsRef.current, {
        rotationX: 360,
        rotationY: 360,
        duration: 30,
        repeat: -1,
        ease: "none"
      });
      
      // Pulse the rings
      gsap.to(".spatial-ring", {
        scale: 1.1,
        opacity: 0.8,
        duration: 2,
        yoyo: true,
        repeat: -1,
        stagger: 0.5,
        ease: "power1.inOut"
      });
    }, ringsRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full bg-[#020202] py-40 border-t border-white/5 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10 text-center relative z-20">
        
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-white/40">Immersive Audio</p>
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6">
          Theater-like sound.<br/> No matter where you turn.
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/60 mb-20">
          Built-in gyroscopes and accelerometers track the micro-movements of your head, anchoring the sound to your device. The result is a fully immersive 360-degree soundstage that makes you feel like you are inside the music.
        </p>

      </div>

      {/* 3D Rings Representation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 mix-blend-screen perspective-[1200px]">
         <div ref={ringsRef} className="relative w-full max-w-[800px] aspect-square flex items-center justify-center transform-style-preserve-3d">
            
            {/* The Headphone center placeholder */}
            <div className="absolute w-32 h-32 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)]" />

            {/* Glowing Rings */}
            <div className="spatial-ring absolute w-[50%] h-[50%] rounded-full border border-cyan-400/30 shadow-[0_0_30px_rgba(0,255,255,0.1)] transform rotate-x-60" />
            <div className="spatial-ring absolute w-[70%] h-[70%] rounded-full border border-purple-400/20 shadow-[0_0_30px_rgba(160,32,240,0.1)] transform rotate-y-60" />
            <div className="spatial-ring absolute w-[90%] h-[90%] rounded-full border border-white/10 transform rotate-x-45 rotate-y-45" />

         </div>
      </div>
    </section>
  );
}
