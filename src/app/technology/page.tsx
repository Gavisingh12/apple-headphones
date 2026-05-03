import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import DeferredSection from "@/components/DeferredSection";
import Navbar from "@/components/Navbar";

// Dynamically import the technology sections
const TechnologySection = dynamic(() => import("@/components/TechnologySection"));
const AudioChipSection = dynamic(() => import("@/components/AudioChipSection"));
const AncVisualizerSection = dynamic(() => import("@/components/AncVisualizerSection"));
const SpatialAudioSection = dynamic(() => import("@/components/SpatialAudioSection"));
const MaterialsBentoGrid = dynamic(() => import("@/components/MaterialsBentoGrid"));
const BatteryPowerSection = dynamic(() => import("@/components/BatteryPowerSection"));

export const metadata: Metadata = {
  title: "AirPods Max | Technology",
  description: "Explore the custom acoustic core and zero-distortion drivers.",
};

export default function TechnologyPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Navbar />
      
      {/* 1. Hero 3D Teardown (240 Frames) */}
      <TechnologySection />

      {/* 2. The Brain: Audio Processing Chip */}
      <DeferredSection placeholderClassName="min-h-[880px] border-t border-white/5 bg-[#020202]">
        <AudioChipSection />
      </DeferredSection>

      {/* 3. ANC Visualizer */}
      <DeferredSection placeholderClassName="min-h-[720px] border-t border-white/5 bg-[#050505]">
        <AncVisualizerSection />
      </DeferredSection>

      {/* 4. Spatial Audio / 3D Sound Rings */}
      <DeferredSection placeholderClassName="min-h-[900px] border-t border-white/5 bg-[#020202]">
        <SpatialAudioSection />
      </DeferredSection>

      {/* 5. Craftsmanship & Materials Bento Grid */}
      <DeferredSection placeholderClassName="min-h-[1080px] border-t border-white/5 bg-[#050505]">
        <MaterialsBentoGrid />
      </DeferredSection>

      {/* 6. Battery & Fast Charge */}
      <DeferredSection placeholderClassName="min-h-[720px] border-t border-white/5 bg-[#020202]">
        <BatteryPowerSection />
      </DeferredSection>

      {/* Outro Banner */}
      <div className="bg-[#020202] py-32 text-center relative z-10">
        <h2 className="mb-8 text-4xl font-medium tracking-tight text-white md:text-6xl">
          Hear it to believe it.
        </h2>
        <Link
          href="/#experience"
          className="inline-block rounded-full bg-white px-10 py-4 text-sm font-medium tracking-[0.2em] uppercase text-black transition-all hover:scale-105 hover:bg-gray-200 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
        >
          Explore the Overview
        </Link>
      </div>
    </main>
  );
}
