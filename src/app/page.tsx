import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { StatsBar } from "@/components/landing/stats-bar";
import { TrustStrip } from "@/components/landing/trust-strip";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Comparison } from "@/components/landing/comparison";
import { Examples } from "@/components/landing/examples";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { StickyMobileCTA } from "@/components/landing/sticky-cta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <TrustStrip />
        <Features />
        <HowItWorks />
        <Comparison />
        <Examples />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
