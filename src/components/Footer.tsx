import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] pt-24 pb-12 border-t border-white/10 text-sm text-white/50">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        
        {/* Top CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-12 mb-12 gap-8">
           <h2 className="text-3xl font-medium text-white tracking-tight">Ready to master your sound?</h2>
           <Link 
             href="#" 
             className="rounded-full bg-white px-8 py-3 text-black font-medium tracking-wide hover:bg-gray-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]"
           >
             Buy AirPods Max
           </Link>
        </div>

        {/* Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-medium mb-2">Shop and Learn</h3>
            <Link href="/" className="hover:text-white transition-colors">AirPods Max</Link>
            <Link href="/" className="hover:text-white transition-colors">AirPods Pro</Link>
            <Link href="/" className="hover:text-white transition-colors">AirPods</Link>
            <Link href="/technology" className="hover:text-white transition-colors">Technology</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-medium mb-2">Account</h3>
            <Link href="#" className="hover:text-white transition-colors">Manage Your ID</Link>
            <Link href="#" className="hover:text-white transition-colors">Apple Store Account</Link>
            <Link href="#" className="hover:text-white transition-colors">iCloud.com</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-medium mb-2">About Apple</h3>
            <Link href="#" className="hover:text-white transition-colors">Newsroom</Link>
            <Link href="#" className="hover:text-white transition-colors">Career Opportunities</Link>
            <Link href="#" className="hover:text-white transition-colors">Investors</Link>
            <Link href="#" className="hover:text-white transition-colors">Ethics & Compliance</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-medium mb-2">Support</h3>
            <Link href="/support" className="hover:text-white transition-colors">Product Help</Link>
            <Link href="/support" className="hover:text-white transition-colors">Repairs</Link>
            <Link href="/support" className="hover:text-white transition-colors">Warranty</Link>
            <Link href="/support" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 gap-4">
          <p>Copyright © {new Date().getFullYear()} Apple Inc. All rights reserved.</p>
          <div className="flex gap-4">
             <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
             <span className="text-white/20">|</span>
             <Link href="#" className="hover:text-white transition-colors">Terms of Use</Link>
             <span className="text-white/20">|</span>
             <Link href="#" className="hover:text-white transition-colors">Sales and Refunds</Link>
             <span className="text-white/20">|</span>
             <Link href="#" className="hover:text-white transition-colors">Legal</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
