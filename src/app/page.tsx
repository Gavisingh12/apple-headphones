import type { Metadata } from "next";
import dynamic from "next/dynamic";
import CinematicHero from "@/components/CinematicHero";
import Navbar from "@/components/Navbar";
import { absoluteUrl } from "@/lib/site";

// Dynamically import the new premium sections
const EcosystemShowcase = dynamic(() => import("@/components/EcosystemShowcase"));
const TypographyMask = dynamic(() => import("@/components/TypographyMask"));
const HorizontalLifestyle = dynamic(() => import("@/components/HorizontalLifestyle"));
const FloatingCallouts = dynamic(() => import("@/components/FloatingCallouts"));
const MagicConnection = dynamic(() => import("@/components/MagicConnection"));
const ColorSwitcher = dynamic(() => import("@/components/ColorSwitcher"));

export const metadata: Metadata = {
  title: "AirPods Max | Overview",
  description:
    "A premium cinematic headphone showcase with a scroll-synced canvas animation.",
  openGraph: {
    title: "AirPods Max | Master Your Sound",
    description: "A premium cinematic headphone showcase.",
    images: [{ url: absoluteUrl("/images/ezgif-frame-040.jpg"), width: 1200, height: 630 }],
  },
};

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Navbar />
      
      {/* 1. Hero 3D Reveal (60 Frames) */}
      <CinematicHero />

      {/* 1.5 The Apple Ecosystem Showcase (Replaces glitchy overlapping text) */}
      <EcosystemShowcase />

      {/* 2. Giant Typography Scroll Mask */}
      <TypographyMask />

      {/* 3. Hotspots & Callouts */}
      <FloatingCallouts />

      {/* 4. Horizontal Parallax Lifestyle Show */}
      <HorizontalLifestyle />

      {/* 5. iOS Pairing Animation Simulation */}
      <MagicConnection />

      {/* 6. Interactive 3D Color Switcher */}
      <ColorSwitcher />

    </main>
  );
}
