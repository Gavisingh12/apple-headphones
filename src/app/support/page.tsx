import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { withBasePath } from "@/lib/site";

export const metadata: Metadata = {
  title: "AirPods Max | Support",
  description: "Get help and support for your Apple devices.",
};

const supportTopics = [
  { icon: "🔧", title: "Repairs & Physical Damage", desc: "Start a repair request or check status." },
  { icon: "🔋", title: "Battery & Charging", desc: "Maximize your listening time." },
  { icon: "🎵", title: "Audio & Connectivity", desc: "Troubleshoot pairing and sound issues." },
  { icon: "🛡️", title: "AppleCare+", desc: "Check your coverage and warranty." },
];

export default function SupportPage() {
  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar />

      {/* Hero Search Section */}
      <section
        className="relative border-b border-white/10 bg-cover bg-center bg-no-repeat px-6 pt-40 pb-20 md:px-10"
        style={{
          backgroundImage: `url(${withBasePath("/images/lifestyle_studio.png")})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-10 drop-shadow-lg">
            Welcome to Apple Support
          </h1>
          
          <div className="relative max-w-2xl mx-auto">
            <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search for topics, products, or answers..." 
              className="w-full py-6 pl-16 pr-8 rounded-full bg-white text-black text-lg focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            />
          </div>
        </div>
      </section>

      {/* Support Topics Grid */}
      <section className="py-32 px-6 md:px-10 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-medium mb-12 text-center">How can we help you?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportTopics.map((topic, i) => (
              <div key={i} className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all hover:-translate-y-2 cursor-pointer group">
                <div className="text-4xl mb-6 bg-white/5 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                  {topic.icon}
                </div>
                <h3 className="text-xl font-medium mb-3">{topic.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 px-6 md:px-10 bg-black">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-b from-[#111] to-black p-12 md:p-20 rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <h2 className="text-4xl font-medium mb-6">Get Support Now</h2>
          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            Choose how you want to get help. You can talk to an Apple Expert on the phone, chat online, or bring your product in for repair.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button className="px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors">Start a Chat</button>
             <button className="px-8 py-4 rounded-full bg-transparent border border-white/20 text-white font-medium hover:bg-white/5 transition-colors">Schedule a Call</button>
          </div>
        </div>
      </section>

    </main>
  );
}
