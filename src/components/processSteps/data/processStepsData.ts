
import { Lightbulb, Sparkles, Share2 } from "lucide-react";

export const steps = [
  {
    id: 1,
    icon: Lightbulb,
    title: "Drop Your Idea",
    subtitle: "Enter any topic or URL",
    description: "Type any topic or paste an article URL. Our AI instantly understands your context.",
    mockup: {
      type: "input",
      content: "AI in professional services"
    },
    stats: { time: "5 sec", action: "to start" }
  },
  {
    id: 2,
    icon: Sparkles,
    title: "AI Works Its Magic",
    subtitle: "Professional frameworks applied",
    description: "Watch as GPT-4 analyzes, structures, and optimizes your content for maximum engagement.",
    mockup: {
      type: "processing",
      content: "Analyzing context..."
    },
    stats: { time: "10 sec", action: "to generate" }
  },
  {
    id: 3,
    icon: Share2,
    title: "Copy & Share",
    subtitle: "LinkedIn-ready in seconds",
    description: "Get a polished post with engagement metrics. One click to copy or share directly.",
    mockup: {
      type: "result",
      content: "🚀 The future of professional services is here..."
    },
    stats: { time: "91%", action: "quality score" }
  }
];

export const stepFeatures = {
  1: [
    "Smart topic suggestions based on trending content",
    "URL scraping extracts key insights from any article",
    "5 professional voice templates to match your style"
  ],
  2: [
    "GPT-4 powered analysis for professional insights",
    "Industry-specific frameworks automatically applied",
    "Engagement optimization based on 50,000+ posts"
  ],
  3: [
    "Quality score ensures your post will perform",
    "One-click copy with perfect LinkedIn formatting",
    "Direct share to LinkedIn with pre-filled content"
  ]
};
