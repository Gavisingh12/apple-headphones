"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function BatteryPowerSection() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fillRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(fillRef.current, 
        { width: "0%" },
        {
          width: "100%",
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: fillRef.current,
            start: "top 80%",
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full bg-[#020202] py-40 border-t border-white/5">
      <div className="mx-auto max-w-4xl px-6 md:px-10 text-center">
        
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6">
          Power that lasts all week.
        </h2>
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-white/60 mb-20">
          Get up to 30 hours of listening time with Active Noise Cancellation and Spatial Audio enabled. In a rush? A quick 5-minute charge delivers 3 hours of listening time.
        </p>

        {/* Battery Graphic */}
        <div className="relative mx-auto w-full max-w-[400px]">
          {/* The Battery Shell */}
          <div className="relative h-16 md:h-20 w-full rounded-[2rem] border-2 border-white/20 bg-white/5 p-2 pr-4 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] flex items-center">
            {/* The Positive Terminal */}
            <div className="absolute -right-3 top-1/2 h-8 w-3 -translate-y-1/2 rounded-r-md border-y-2 border-r-2 border-white/20 bg-white/5" />
            
            {/* The Charge Fill */}
            <div 
              ref={fillRef} 
              className="h-full rounded-[1.5rem] bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.5)]" 
              style={{ width: "0%" }}
            />
          </div>
          
          <div className="mt-8 flex justify-between text-sm font-medium tracking-widest text-white/40 uppercase">
            <span>0 Hrs</span>
            <span className="text-emerald-400">30 Hrs Max</span>
          </div>
        </div>

      </div>
    </section>
  );
}
