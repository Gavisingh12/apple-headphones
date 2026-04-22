"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MagicConnection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const headphoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        }
      });

      // Phone slides in
      tl.fromTo(phoneRef.current, 
        { y: 150, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
      // Headphones slightly bounce
      .fromTo(headphoneRef.current,
        { scale: 0.95 },
        { scale: 1, duration: 0.5, ease: "back.out(1.5)" },
        "-=0.5"
      )
      // Pop-up UI Card appears exactly like iOS
      .fromTo(popupRef.current,
        { y: 50, scale: 0.8, opacity: 0, rotationX: 20 },
        { y: 0, scale: 1, opacity: 1, rotationX: 0, duration: 0.7, ease: "elastic.out(1, 0.7)" },
        "-=0.2"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-black py-40 overflow-hidden perspective-[1000px]">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        
        <div className="grid md:grid-cols-2 gap-20 items-center">
          
          <div className="order-2 md:order-1 relative h-[500px] flex items-center justify-center">
            {/* Abstract representations to keep it clean and fast */}
            
            {/* Glowing background aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl" />

            {/* Smartphone Graphic */}
            <div ref={phoneRef} className="absolute left-1/4 bottom-10 w-48 h-96 rounded-[3rem] border-[6px] border-white/10 bg-[#0a0a0a] shadow-2xl z-10 flex flex-col items-center pt-6">
               <div className="w-16 h-4 rounded-full bg-black" /> {/* Dynamic Island */}
            </div>

            {/* Headphones Graphic */}
            <div ref={headphoneRef} className="absolute right-1/4 top-20 w-40 h-40 rounded-full border-[8px] border-white/20 bg-gradient-to-tr from-white/5 to-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] z-0" />

            {/* "Connected" Pop-up UI Card */}
            <div ref={popupRef} className="absolute bottom-32 left-1/2 -translate-x-1/2 w-64 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 flex flex-col items-center transform-style-preserve-3d">
              <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 animate-pulse flex items-center justify-center">
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <p className="text-white font-medium text-lg">AirPods Max</p>
              <p className="text-white/50 text-sm mb-4">Connected</p>
              <div className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-black/30">
                 <span className="text-xs text-white/70">Battery</span>
                 <span className="text-xs font-bold text-emerald-400">100%</span>
              </div>
            </div>

          </div>

          <div className="order-1 md:order-2">
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-white/40">Seamless Magic</p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
              Instant connection.<br/> Zero configuration.
            </h2>
            <p className="text-lg leading-relaxed text-white/60 mb-8">
              Bring AirPods Max near your device and tap Connect. Instantly paired across your entire ecosystem. When you take them off, the music pauses magically. It just works.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
