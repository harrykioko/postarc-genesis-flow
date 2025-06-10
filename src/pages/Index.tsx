
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

const Index = () => {
  const [showDemo, setShowDemo] = useState(false);

  const handleTryNowClick = () => {
    setShowDemo(true);
  };

  return (
    <div className="min-h-screen bg-gradient-brand">
      <Header />
      <Hero />
      <ProcessSteps onTryNowClick={handleTryNowClick} />
      <BeforeAfter />
      <TrustMetrics />
      <PostShowcase onTryNowClick={handleTryNowClick} />
      <Pricing />
      <FAQ />
      <Footer />
      
      <DemoModal 
        open={showDemo} 
        onOpenChange={setShowDemo}
      />
    </div>
  );
};

export default Index;
