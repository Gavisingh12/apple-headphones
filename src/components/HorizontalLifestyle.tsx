"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { withBasePath } from "@/lib/site";

const lifestyleImages = [
  {
    src: withBasePath("/images/lifestyle_studio.png"),
    alt: "Studio Environment",
    title: "Pro Grade.",
    desc: "Engineered for creators. Tuned for truth."
  },
  {
    src: withBasePath("/images/lifestyle_city.png"),
    alt: "City Street",
    title: "City Proof.",
    desc: "Active noise cancellation completely silences the urban chaos."
  },
  {
    src: withBasePath("/images/lifestyle_plane.png"),
    alt: "Airplane Cabin",
    title: "First Class.",
    desc: "Transform any flight into a private, serene concert hall."
  }
];

export default function HorizontalLifestyle() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray(".lifestyle-slide");
      
      gsap.to(slides, {
        xPercent: -100 * (slides.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (slides.length - 1),
          end: () => "+=" + containerRef.current!.offsetWidth,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full bg-black overflow-hidden">
      <div ref={containerRef} className="absolute top-0 left-0 flex h-full w-[300vw]">
        
        {lifestyleImages.map((image, index) => (
          <div key={index} className="lifestyle-slide relative h-full w-screen flex-shrink-0 flex items-center justify-center overflow-hidden">
            
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-black/80" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-5xl px-6 md:px-12 flex flex-col justify-end h-full pb-32">
              <h2 className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-4 drop-shadow-2xl">
                {image.title}
              </h2>
              <p className="text-xl md:text-3xl text-white/80 max-w-2xl drop-shadow-xl font-light">
                {image.desc}
              </p>
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}
