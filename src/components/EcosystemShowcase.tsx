"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { withBasePath } from "@/lib/site";

const ecosystemItems = [
  {
    title: "AirPods Pro",
    desc: "Uncompromising engineering packed into a perfectly balanced wireless earbud. Pure fidelity, zero wires.",
    image: withBasePath("/images/ecosystem_1.jpg"),
  },
  {
    title: "AirPods",
    desc: "Studio-grade in-ear monitors. Crafted for the absolute purists who demand to hear every microscopic detail.",
    image: withBasePath("/images/ecosystem_2.jpg"),
  },
  {
    title: "AirPods Max",
    desc: "The pinnacle of spatial audio. Over-ear comfort meeting unprecedented acoustic performance and pure silence.",
    image: withBasePath("/images/ecosystem_3.png"),
  }
];

export default function EcosystemShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Pin the showcase box perfectly in the center of the screen
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "center center",
        end: "+=200%", // Scroll for 2 screen heights
        pin: true,
        scrub: true,
        anticipatePin: 1,
      });

      // We have 3 items. 
      // 0 to 0.33 -> item 1
      // 0.33 to 0.66 -> item 2
      // 0.66 to 1.0 -> item 3
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "center center",
          end: "+=200%",
          scrub: true,
        }
      });

      // Hide all except first initially
      gsap.set(textRefs.current.slice(1), { opacity: 0, y: 20 });
      gsap.set(imageRefs.current.slice(1), { opacity: 0, scale: 1.05 });

      // Animate transition 1 -> 2
      tl.to(textRefs.current[0], { opacity: 0, y: -20, duration: 1 })
        .to(imageRefs.current[0], { opacity: 0, duration: 1 }, "<")
        .to(textRefs.current[1], { opacity: 1, y: 0, duration: 1 }, "<")
        .to(imageRefs.current[1], { opacity: 1, scale: 1, duration: 1 }, "<")
        
        // Wait
        .to({}, { duration: 1 })

        // Animate transition 2 -> 3
        .to(textRefs.current[1], { opacity: 0, y: -20, duration: 1 })
        .to(imageRefs.current[1], { opacity: 0, duration: 1 }, "<")
        .to(textRefs.current[2], { opacity: 1, y: 0, duration: 1 }, "<")
        .to(imageRefs.current[2], { opacity: 1, scale: 1, duration: 1 }, "<")
        
        // Final Wait
        .to({}, { duration: 1 });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-black py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        
        <div className="text-center mb-16">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-white/40">The Apple Lineup</p>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
            Sound for every moment.
          </h2>
        </div>

        {/* Extra height for scrolling */}
        <div className="relative h-[200vh]">
          
          {/* Pinned Container Box */}
          <div 
            ref={containerRef} 
            className="absolute top-0 w-full h-[60vh] min-h-[400px] max-h-[600px] rounded-[2rem] border border-white/10 bg-[#080808] overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            
            {/* Left Column: Text */}
            <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative">
               {ecosystemItems.map((item, index) => (
                 <div 
                   key={`text-${index}`}
                   ref={el => { textRefs.current[index] = el; }}
                   className="absolute left-10 md:left-16 right-10 md:right-16 top-1/2 -translate-y-1/2"
                 >
                   <h3 className="text-3xl md:text-5xl font-medium text-white mb-6 tracking-tight">
                     {item.title}
                   </h3>
                   <p className="text-white/60 text-lg leading-relaxed">
                     {item.desc}
                   </p>
                 </div>
               ))}
            </div>

            {/* Right Column: Image */}
            <div className="w-full md:w-1/2 relative h-full bg-[#111] overflow-hidden">
               {ecosystemItems.map((item, index) => (
                 <Image
                   key={`img-${index}`}
                   ref={el => { imageRefs.current[index] = el; }}
                   src={item.image}
                   alt={item.title}
                   fill
                   className="object-cover absolute inset-0"
                 />
               ))}
               {/* Elegant gradient overlay to blend the edge */}
               <div className="absolute inset-0 bg-gradient-to-r from-[#080808] to-transparent w-24 hidden md:block" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent h-24 md:hidden" />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
