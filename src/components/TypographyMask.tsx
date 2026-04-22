"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function TypographyMask() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // The text scales down dramatically into the center as we scroll
      gsap.fromTo(
        textRef.current,
        { scale: 5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "center center",
            scrub: 1,
          },
        }
      );

      // Fade out on scroll up
      gsap.to(textRef.current, {
        opacity: 0,
        scale: 0.8,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "center center",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[150vh] w-full bg-black overflow-hidden flex items-center justify-center">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Animated Gradient Background that shows THROUGH the text */}
        <div className="absolute inset-0 bg-black z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.4),rgba(0,0,0,1))] z-10 opacity-50 mix-blend-screen animate-pulse" />

        {/* Masked Text */}
        <h1 
          ref={textRef}
          className="relative z-20 font-bold text-center uppercase tracking-tighter"
          style={{
            fontSize: "clamp(5rem, 15vw, 20rem)",
            lineHeight: 0.9,
            background: "linear-gradient(to bottom right, #ffffff, #666666, #00ffff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% 200%",
            animation: "gradient-shift 5s ease infinite",
          }}
        >
          Pure.<br/>Silence.
        </h1>

      </div>
    </section>
  );
}
