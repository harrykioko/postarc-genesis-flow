import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProcessSteps } from "@/components/ProcessSteps";
import { BeforeAfter } from "@/components/BeforeAfter";
import { TrustMetrics } from "@/components/TrustMetrics";
import { PostShowcase } from "@/components/PostShowcase";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { DemoModal } from "@/components/DemoModal";
import { SectionTransition } from "@/components/ui/SectionTransition";
import { GlassDivider } from "@/components/ui/GlassDivider";

const Index = () => {
  const [showDemo, setShowDemo] = useState(false);

  const handleTryNowClick = () => {
    setShowDemo(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen">
        <Hero />
      </section>

      <GlassDivider position="bottom" className="-mt-12 z-20" />

      {/* How It Works */}
      <SectionTransition background="glassy-gradient">
        <ProcessSteps onTryNowClick={handleTryNowClick} />
      </SectionTransition>

      <GlassDivider position="bottom" className="-mt-12 z-20" />

      {/* Before/After */}
      <SectionTransition background="glassy">
        <BeforeAfter />
      </SectionTransition>

      <GlassDivider position="bottom" className="-mt-12 z-20" />

      {/* Trust Metrics */}
      <SectionTransition background="glassy-gradient">
        <TrustMetrics />
      </SectionTransition>

      <GlassDivider position="bottom" className="-mt-12 z-20" />

      {/* Post Showcase */}
      <SectionTransition background="glassy">
        <PostShowcase onTryNowClick={handleTryNowClick} />
      </SectionTransition>

      <GlassDivider position="bottom" className="-mt-12 z-20" />

      {/* Pricing */}
      <SectionTransition background="glassy-gradient">
        <Pricing />
      </SectionTransition>

      <GlassDivider position="bottom" className="-mt-12 z-20" />

      {/* FAQ */}
      <SectionTransition background="glassy" withDivider={false}>
        <FAQ />
      </SectionTransition>

      <Footer />
      
      <DemoModal 
        open={showDemo} 
        onOpenChange={setShowDemo}
      />
    </div>
  );
};

export default Index;
