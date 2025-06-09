
import { Lightbulb, Briefcase, Rocket, TrendingUp, Users, DollarSign, Building2 } from "lucide-react";

interface TemplateFoundationStepProps {
  selectedFoundation: string;
  onFoundationSelect: (foundation: string) => void;
}

export const TemplateFoundationStep = ({ selectedFoundation, onFoundationSelect }: TemplateFoundationStepProps) => {
  const foundations = [
    {
      id: "fresh",
      name: "Start Fresh",
      description: "Build from scratch",
      icon: Lightbulb,
      color: "bg-purple-500"
    },
    {
      id: "consultant",
      name: "Professional",
      description: "Like Consultant template",
      icon: Briefcase,
      color: "bg-blue-500"
    },
    {
      id: "founder",
      name: "Entrepreneurial",
      description: "Like Founder template",
      icon: Rocket,
      color: "bg-purple-500"
    },
    {
      id: "vc",
      name: "Investment-Focused",
      description: "Like VC template",
      icon: TrendingUp,
      color: "bg-green-500"
    },
    {
      id: "sales",
      name: "Data-Driven",
      description: "Like Sales template",
      icon: DollarSign,
      color: "bg-orange-500"
    },
    {
      id: "hr",
      name: "People-First",
      description: "Like HR template",
      icon: Users,
      color: "bg-pink-500"
    },
    {
      id: "business_representative",
      name: "Business Representative",
      description: "Post on behalf of a company or organization",
      icon: Building2,
      color: "bg-indigo-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-midnight mb-2">
          Start with a base style
        </h3>
        <p className="text-slate">
          Choose a foundation that matches your professional voice
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {foundations.map((foundation) => {
          const Icon = foundation.icon;
          return (
            <div
              key={foundation.id}
              onClick={() => onFoundationSelect(foundation.id)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                selectedFoundation === foundation.id
                  ? 'border-neon bg-mint/10 shadow-lg'
                  : 'border-slate/20 hover:border-neon/50 bg-white/70'
              }`}
            >
              <div className="text-center space-y-3">
                <div className={`w-12 h-12 rounded-full ${foundation.color} flex items-center justify-center mx-auto`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-midnight">{foundation.name}</h4>
                <p className="text-sm text-slate">{foundation.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
