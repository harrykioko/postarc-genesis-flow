
import { BookOpen, List, Search, BarChart3, MessageCircle } from "lucide-react";

interface TemplateStructureStepProps {
  selectedStructure: string;
  onStructureSelect: (structure: string) => void;
}

export const TemplateStructureStep = ({ selectedStructure, onStructureSelect }: TemplateStructureStepProps) => {
  const structures = [
    {
      id: "story",
      name: "Story Format",
      description: "Hook → Personal story → Lesson learned",
      icon: BookOpen,
      example: "Share a personal experience that leads to professional insights"
    },
    {
      id: "insight_list",
      name: "Insight List",
      description: "Intro → 3-5 key points → Conclusion",
      icon: List,
      example: "Present multiple related insights in an organized format"
    },
    {
      id: "problem_solution",
      name: "Problem/Solution",
      description: "Issue → Analysis → Your solution",
      icon: Search,
      example: "Identify a challenge and present your approach to solving it"
    },
    {
      id: "case_study",
      name: "Case Study",
      description: "Challenge → Process → Results with metrics",
      icon: BarChart3,
      example: "Detail a specific project with measurable outcomes"
    },
    {
      id: "opinion",
      name: "Opinion Piece",
      description: "Viewpoint → Supporting evidence → Call for discussion",
      icon: MessageCircle,
      example: "Share your perspective on industry trends or practices"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-midnight mb-2">
          How do you like to organize your thoughts?
        </h3>
        <p className="text-slate">
          Choose the structure that best fits your storytelling style
        </p>
      </div>

      <div className="space-y-4">
        {structures.map((structure) => {
          const Icon = structure.icon;
          return (
            <div
              key={structure.id}
              onClick={() => onStructureSelect(structure.id)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedStructure === structure.id
                  ? 'border-neon bg-mint/10 shadow-lg'
                  : 'border-slate/20 hover:border-neon/50 bg-white/70'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-midnight/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-midnight" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-midnight mb-1">{structure.name}</h4>
                  <p className="text-sm text-slate mb-2">{structure.description}</p>
                  <p className="text-xs text-slate/70 italic">{structure.example}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
