import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { siteOrigin } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "Apple",
    template: "%s | Apple",
  },
  description:
    "A premium interactive product experience for luxury wireless headphones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-black text-white">
        {children}
        <Footer />
      </body>
    </html>
  );
}
