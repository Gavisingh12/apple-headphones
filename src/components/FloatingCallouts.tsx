"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { withBasePath } from "@/lib/site";

const callouts = [
  {
    title: "Digital Crown",
    desc: "Precision control for volume and tracks.",
    position: "top-1/4 left-10 md:left-20",
  },
  {
    title: "Woven Canopy",
    desc: "Distributes weight to reduce on-head pressure.",
    position: "top-1/2 right-10 md:right-20",
  },
  {
    title: "Anodized Cups",
    desc: "Acoustically balanced and beautifully crafted.",
    position: "bottom-1/4 left-10 md:left-32",
  }
];

export default function FloatingCallouts() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".callout-card");
      
      // Pin the section and fade in cards as you scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
        }
      });

      cards.forEach((card: any, i) => {
        tl.fromTo(card, 
          { opacity: 0, y: 50, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" },
          i * 0.5 // stagger
        );
      });
      
      // Add some buffer at the end before unpinning
      tl.to({}, { duration: 1 });
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-[#050505] overflow-hidden">
      
      <div className="absolute inset-0 flex items-center justify-center">
        {/* We use a beautifully AI-generated exterior shot specifically for these callouts */}
        <div className="relative w-full max-w-4xl aspect-[4/3] opacity-80 mt-10">
           <Image
             src={withBasePath("/images/headphone_callouts_base.png")}
             alt="Apple Exterior Architecture"
             fill
             className="object-contain mix-blend-screen"
             loading="lazy"
           />
        </div>
      </div>

      <div className="absolute inset-0 w-full max-w-7xl mx-auto pointer-events-none">
        {callouts.map((callout, index) => (
          <div 
            key={index} 
            className={`callout-card absolute ${callout.position} max-w-xs p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.5)]`}
          >
            <h3 className="text-xl font-medium text-white mb-2">{callout.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{callout.desc}</p>
          </div>
        ))}
      </div>
      
    </section>
  );
}
