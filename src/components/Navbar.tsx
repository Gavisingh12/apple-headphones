"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", path: "/" },
    { name: "Technology", path: "/technology" },
    { name: "Support", path: "/support" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <Link href="/" className="rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm font-medium tracking-[0.22em] text-white/88 backdrop-blur-2xl transition-colors hover:bg-white/10 hover:text-white">
          AirPods Max
        </Link>

        <div className="hidden md:flex space-x-2 rounded-full border border-white/10 bg-black/40 px-2 py-1.5 backdrop-blur-2xl">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`rounded-full px-5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 ${
                  isActive
                    ? "bg-white text-black shadow-lg"
                    : "text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <Link
          className="rounded-full border border-white/12 bg-white/[0.06] px-5 py-2.5 text-[0.68rem] uppercase tracking-[0.38em] text-white/70 transition duration-300 hover:border-white/25 hover:bg-white/[0.12] hover:text-white"
          href="/#experience"
        >
          Buy Now
        </Link>
      </div>
    </header>
  );
}
