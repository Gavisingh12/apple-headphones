"use client";

import Image from "next/image";
import { withBasePath } from "@/lib/site";

export default function MaterialsBentoGrid() {
  return (
    <section className="w-full bg-[#050505] py-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-white/40">Craftsmanship</p>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
            Engineered without compromise.
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-6 md:grid-cols-3 md:grid-rows-2">
          
          {/* Card 1: Aluminum */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] md:col-span-2 aspect-[2/1] md:aspect-auto min-h-[300px]">
            <Image
              src={withBasePath("/images/material_aluminum.png")}
              alt="Anodized Aluminum Cups"
              fill
              className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="text-2xl font-medium text-white mb-2">Anodized Aluminum</h3>
              <p className="text-white/60 max-w-md">The ear cups are machined from a single block of aerospace-grade aluminum, balancing acoustic rigidity with feather-light weight.</p>
            </div>
          </div>

          {/* Card 2: Acoustic Mesh */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] min-h-[300px]">
            <Image
              src={withBasePath("/images/material_mesh.png")}
              alt="Custom Acoustic Mesh"
              fill
              className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="text-2xl font-medium text-white mb-2">Acoustic Mesh</h3>
              <p className="text-white/60">A custom-designed canopy minimizes on-head pressure.</p>
            </div>
          </div>

          {/* Card 3: Telescoping Arms */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111111] p-8 flex flex-col justify-end min-h-[300px]">
            <Image
              src={withBasePath("/images/material_hinge.png")}
              alt="Stainless Steel Friction Hinge"
              fill
              className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center z-10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-medium text-white mb-2">Friction Hinge</h3>
              <p className="text-white/60">The stainless steel telescoping arms extend smoothly and stay exactly where you set them for a consistent seal.</p>
            </div>
          </div>

          {/* Card 4: Memory Foam */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] md:col-span-2 min-h-[300px] flex items-end p-8">
            <Image
              src={withBasePath("/images/material_foam.png")}
              alt="Magnetic Memory Foam"
              fill
              className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="relative z-10 max-w-md">
                <h3 className="text-2xl font-medium text-white mb-2">Magnetic Memory Foam</h3>
                <p className="text-white/60">Acoustically engineered memory foam cushions create an immersive seal. They attach magnetically, allowing you to easily swap them out.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
