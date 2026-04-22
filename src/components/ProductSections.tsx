import Image from "next/image";
import DetailFrameSection from "@/components/DetailFrameSection";
import OverviewLoopSection from "@/components/OverviewLoopSection";
import { withBasePath } from "@/lib/site";

const productName = "AirPods Max";

// Swap this to /image.png when you drop the final still into public/.
const featureStillSrc = withBasePath("/images/ezgif-frame-001.jpg");
const detailStillSrc = withBasePath("/images/ezgif-frame-040.jpg");

export default function ProductSections() {
  return (
    <div className="relative z-10 bg-black">
      <section className="border-t border-white/6 bg-black px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-6 text-[0.68rem] uppercase tracking-[0.45em] text-white/35">
            Signature Statement
          </p>
          <h2 className="text-balance text-4xl font-medium tracking-[-0.06em] text-white/92 md:text-6xl">
            &quot;The {productName} isn&apos;t just a headphone.
            <br className="hidden md:block" /> It&apos;s a sanctuary.&quot;
          </h2>
        </div>
      </section>

      <section className="bg-black px-6 py-8 md:px-10 md:py-12">
        <div className="mx-auto grid max-w-7xl items-center gap-10 rounded-[2rem] border border-white/8 bg-white/[0.02] px-6 py-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:px-8 md:py-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="order-2 lg:order-1">
            <p className="mb-4 text-[0.68rem] uppercase tracking-[0.42em] text-white/35">
              Sound Architecture
            </p>
            <h3 className="mb-5 text-4xl font-medium tracking-[-0.06em] text-white md:text-6xl">
              Mastering-grade Sound.
            </h3>
            <p className="max-w-xl text-lg leading-8 text-white/60">
              {productName} is tuned for long sessions, precise low-end control,
              and a studio-dark listening atmosphere that feels calm instead of
              crowded.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/55">
                Spatial Depth
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/55">
                Adaptive Silence
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/55">
                Cinema Finish
              </span>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.7rem] border border-white/8 bg-[#030303]">
              <Image
                src={featureStillSrc}
                alt={`${productName} studio still`}
                fill
                priority={false}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover object-center scale-[1.12]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.16),rgba(0,0,0,0)_34%,rgba(0,0,0,0.15))]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_36%,rgba(0,0,0,0.22)_60%,rgba(0,0,0,0.72)_100%)]" />
              <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.97)_0%,rgba(0,0,0,0.86)_38%,rgba(0,0,0,0)_74%)] blur-xl md:h-56 md:w-56" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-6 py-8 md:px-10 md:py-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[1.8rem] border border-white/8 bg-[#020202]">
            <Image
              src={detailStillSrc}
              alt={`${productName} detail view`}
              fill
              priority={false}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover object-center scale-[1.18]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78),rgba(0,0,0,0.15)_42%,rgba(0,0,0,0.28)_100%)]" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-xl px-6 md:px-10">
                <p className="mb-3 text-[0.68rem] uppercase tracking-[0.42em] text-white/35">
                  Focused Design
                </p>
                <h3 className="mb-4 text-3xl font-medium tracking-[-0.05em] text-white md:text-5xl">
                  A quieter silhouette, built for immersion.
                </h3>
                <p className="text-base leading-7 text-white/58 md:text-lg">
                  Sculpted surfaces, controlled reflections, and a calm studio
                  atmosphere keep the focus on comfort, finish, and precision.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.97)_0%,rgba(0,0,0,0.86)_38%,rgba(0,0,0,0)_74%)] blur-xl md:h-56 md:w-56" />
          </div>

          <div className="rounded-[1.8rem] border border-white/8 bg-white/[0.02] p-6 md:p-8">
            <p className="mb-3 text-[0.68rem] uppercase tracking-[0.42em] text-white/35">
              Product Name
            </p>
            <h3 className="mb-4 text-3xl font-medium tracking-[-0.05em] text-white md:text-4xl">
              {productName}
            </h3>
            <p className="mb-8 text-base leading-7 text-white/58">
              A premium identity system built for a quieter, more custom product
              story from hero reveal to detailed overview.
            </p>
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/8 bg-black/40 p-5">
                <p className="mb-2 text-[0.68rem] uppercase tracking-[0.34em] text-white/35">
                  Surface Language
                </p>
                <p className="text-sm leading-6 text-white/60">
                  Soft gradients, centered composition, and shadow shaping keep
                  the presentation cinematic.
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/40 p-5">
                <p className="mb-2 text-[0.68rem] uppercase tracking-[0.34em] text-white/35">
                  Watermark Control
                </p>
                <p className="text-sm leading-6 text-white/60">
                  Bottom-right masking and tighter framing are used in every
                  section that renders the source frames.
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/40 p-5">
                <p className="mb-2 text-[0.68rem] uppercase tracking-[0.34em] text-white/35">
                  Story Ready
                </p>
                <p className="text-sm leading-6 text-white/60">
                  The layout is already structured for more stills, more motion,
                  and deeper product storytelling in the next pass.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OverviewLoopSection productName={productName} />
      <DetailFrameSection productName={productName} />
    </div>
  );
}
