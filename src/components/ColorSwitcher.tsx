"use client";

import { useState } from "react";
import Image from "next/image";
import { withBasePath } from "@/lib/site";

const colors = [
  {
    id: "silver",
    name: "Starlight Silver",
    hex: "#e2e8f0",
    filter: "brightness(1) saturate(1) hue-rotate(0deg)",
  },
  {
    id: "black",
    name: "Space Black",
    hex: "#171717",
    filter: "brightness(0.3) saturate(0) contrast(1.2)",
  },
  {
    id: "blue",
    name: "Sky Blue",
    hex: "#38bdf8",
    filter: "brightness(0.8) saturate(1.5) hue-rotate(180deg)",
  }
];

export default function ColorSwitcher() {
  const [activeColor, setActiveColor] = useState(colors[0]);

  return (
    <section className="relative w-full bg-[#050505] py-40 border-t border-white/5 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10 flex flex-col items-center">
        
        <div className="text-center mb-20 relative z-20">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-white/40">The Showroom</p>
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-white">
            Designed to stand out.
          </h2>
        </div>

        {/* Headphone Display */}
        <div className="relative w-full max-w-4xl aspect-[16/9] flex items-center justify-center mb-16">
          
          {/* Glowing pedestal effect behind the headphones */}
          <div 
            className="absolute bottom-10 w-3/4 h-20 rounded-[100%] blur-3xl opacity-30 transition-colors duration-1000 ease-in-out"
            style={{ backgroundColor: activeColor.hex }}
          />

          <div className="relative w-full h-full max-h-[500px]">
             {/* Using a base image and CSS filters to change colors instantly and smoothly */}
             <Image
               src={withBasePath("/images/headphone_silver_exterior.png")}
               alt={`AirPods Max in ${activeColor.name}`}
               fill
               className="object-contain transition-all duration-1000 ease-in-out mix-blend-screen"
               style={{ filter: activeColor.filter }}
               loading="lazy"
             />
          </div>

        </div>

        {/* Color Controls */}
        <div className="flex flex-col items-center z-20">
          <p className="text-white/60 mb-8 font-light tracking-wide text-lg transition-colors duration-500">
            {activeColor.name}
          </p>
          
          <div className="flex gap-6">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setActiveColor(color)}
                className={`group relative flex h-16 w-16 items-center justify-center rounded-full transition-transform hover:scale-110 focus:outline-none ${
                  activeColor.id === color.id ? "scale-110" : ""
                }`}
                aria-label={`Select ${color.name}`}
              >
                {/* Selection Ring */}
                <div 
                  className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
                    activeColor.id === color.id ? "border-white scale-100 opacity-100" : "border-transparent scale-75 opacity-0 group-hover:border-white/30 group-hover:scale-100 group-hover:opacity-100"
                  }`}
                />
                
                {/* Color Dot */}
                <div 
                  className="h-10 w-10 rounded-full border border-white/20 shadow-inner transition-transform duration-300"
                  style={{ 
                    backgroundColor: color.hex,
                    transform: activeColor.id === color.id ? "scale(0.85)" : "scale(1)"
                  }}
                />
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
