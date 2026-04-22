"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function DesignStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !text1Ref.current || !text2Ref.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        }
      });

      // Fade in first text, then fade it out
      tl.fromTo(text1Ref.current, 
          { opacity: 0, y: 50 }, 
          { opacity: 1, y: 0, duration: 1 }
        )
        .to(text1Ref.current, { opacity: 0, y: -50, duration: 1 }, "+=0.5")
        // Then fade in second text
        .fromTo(text2Ref.current, 
          { opacity: 0, y: 50 }, 
          { opacity: 1, y: 0, duration: 1 },
          "-=0.5"
        );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[150vh] w-full bg-black flex flex-col items-center justify-center">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        
        {/* We absolutely position both text elements in the center and control opacity with GSAP */}
        <h2 ref={text1Ref} className="absolute text-4xl md:text-7xl font-medium tracking-tight text-white text-center px-6">
          Uncompromising<br />
          <span className="text-white/40">Engineering.</span>
        </h2>

        <h2 ref={text2Ref} className="absolute text-4xl md:text-7xl font-medium tracking-tight text-white text-center px-6 opacity-0">
          Unprecedented<br />
          <span className="text-white/40">Comfort.</span>
        </h2>

      </div>
    </section>
  );
}
