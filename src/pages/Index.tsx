
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
import { WaveDivider } from "@/components/WaveDivider";

const Index = () => {
  const [showDemo, setShowDemo] = useState(false);

  const handleTryNowClick = () => {
    setShowDemo(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section - Pure white with dot pattern */}
      <section className="section-white section-transition relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots z-0" />
        <div className="absolute top-20 -left-40 w-80 h-80 bg-neon/5 rounded-full blur-3xl z-0" />
        <div className="relative z-10">
          <Hero />
        </div>
        <WaveDivider color="#F8FBFF" />
      </section>

      {/* How It Works - Soft blue gradient */}
      <section className="section-soft section-transition relative">
        <div className="relative z-10">
          <ProcessSteps onTryNowClick={handleTryNowClick} />
        </div>
        <WaveDivider color="#FFFFFF" />
      </section>

      {/* Before/After - White background */}
      <section className="section-white section-transition relative">
        <div className="relative z-10">
          <BeforeAfter />
        </div>
        <WaveDivider color="#F5FFFD" />
      </section>

      {/* Trust Metrics - Feature gradient with dots */}
      <section className="section-feature section-transition relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots z-0" />
        <div className="relative z-10">
          <TrustMetrics />
        </div>
        <WaveDivider color="#F8FBFF" />
      </section>

      {/* PostShowcase - Soft blue */}
      <section className="section-soft section-transition relative">
        <div className="absolute bottom-20 -right-40 w-80 h-80 bg-midnight/5 rounded-full blur-3xl z-0" />
        <div className="relative z-10">
          <PostShowcase onTryNowClick={handleTryNowClick} />
        </div>
        <WaveDivider color="#FFFFFF" />
      </section>

      {/* Pricing - White with grid pattern */}
      <section className="section-white section-transition relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid z-0" />
        <div className="relative z-10">
          <Pricing />
        </div>
        <WaveDivider color="#F8FBFF" />
      </section>

      {/* FAQ - Soft ending */}
      <section className="section-soft section-transition relative">
        <div className="relative z-10">
          <FAQ />
        </div>
      </section>

      <Footer />
      
      <DemoModal 
        open={showDemo} 
        onOpenChange={setShowDemo}
      />
    </div>
  );
};

export default Index;
