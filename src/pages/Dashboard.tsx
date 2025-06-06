
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PostGenerator } from "@/components/dashboard/PostGenerator";
import { GeneratedPost } from "@/components/dashboard/GeneratedPost";
import { SummaryMetrics } from "@/components/dashboard/SummaryMetrics";
import { PostHistory } from "@/components/dashboard/PostHistory";
import { useState } from "react";

const Dashboard = () => {
  const [generatedPost, setGeneratedPost] = useState<string>("");

  return (
    <div className="min-h-screen bg-gradient-animated">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Post Generator & Generated Post */}
          <div className="lg:col-span-2 space-y-8">
            <PostGenerator onPostGenerated={setGeneratedPost} />
            {generatedPost && <GeneratedPost content={generatedPost} />}
            
            {/* Post History - Full Width Below Generator */}
            <div className="lg:col-span-3">
              <PostHistory />
            </div>
          </div>
          
          {/* Right Sidebar - Summary Metrics */}
          <div className="lg:col-span-1">
            <SummaryMetrics />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
