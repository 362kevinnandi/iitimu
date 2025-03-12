import { AnimatedCoreFeatureSection } from "@/components/home/animated-core-features";
import { CTA } from "@/components/home/cta-section";
import {
  KeyFeaturesSection,
  PowerfulFeaturesSection,
} from "@/components/home/features-section";
import { FooterSection } from "@/components/home/footer-section";
import { HeroSection } from "@/components/home/hero-section";
import { PricingSection } from "@/components/home/pricing";
import { StatSection } from "@/components/home/stats-section";
import { Testimonial } from "@/components/home/testimonial";

const HomePage = () => {
  return (
    <main className="space-y-6">
      <HeroSection />

      {/* <CoreFeatureSection /> */}

      <AnimatedCoreFeatureSection />

      <section id="features">
        <KeyFeaturesSection />

        <PowerfulFeaturesSection />
      </section>

      <Testimonial />

      <StatSection />

      <PricingSection />

      <section>
        <CTA />

        <FooterSection />
      </section>
    </main>
  );
};

export default HomePage;
