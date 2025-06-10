
import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PostShowcase } from "@/components/PostShowcase";
import { ProcessSteps } from "@/components/ProcessSteps";
import { TrustMetrics } from "@/components/TrustMetrics";
import { BeforeAfter } from "@/components/BeforeAfter";
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
      <PostShowcase onTryNowClick={handleTryNowClick} />
      <ProcessSteps onTryNowClick={handleTryNowClick} />
      <TrustMetrics />
      <BeforeAfter />
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
