
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TemplateIndustryStepProps {
  industryContext: string;
  onIndustryChange: (industry: string) => void;
}

export const TemplateIndustryStep = ({ industryContext, onIndustryChange }: TemplateIndustryStepProps) => {
  const popularIndustries = [
    "SaaS", "Real Estate", "Healthcare", "Finance", "Marketing", "HR",
    "Consulting", "EdTech", "E-commerce", "Manufacturing", "Legal", "Construction"
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-midnight mb-2">
          Add industry context
        </h3>
        <p className="text-slate">
          Help us understand your expertise (optional but recommended)
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <Label htmlFor="industry" className="text-base font-medium">
            I work in:
          </Label>
          <Input
            id="industry"
            placeholder="Enter your industry or field"
            value={industryContext}
            onChange={(e) => onIndustryChange(e.target.value)}
            className="mt-2 border-slate/20 focus:ring-mint/40"
          />
        </div>

        <div>
          <p className="text-sm text-slate mb-3">Popular industries:</p>
          <div className="flex flex-wrap gap-2">
            {popularIndustries.map((industry) => (
              <button
                key={industry}
                onClick={() => onIndustryChange(industry)}
                className={`px-3 py-1 text-sm rounded-full border transition-all duration-200 ${
                  industryContext === industry
                    ? 'border-neon bg-mint/10 text-midnight'
                    : 'border-slate/20 text-slate hover:border-neon/50 hover:bg-mint/5'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>

        {industryContext && (
          <div className="bg-mint/10 p-4 rounded-lg">
            <h4 className="font-medium text-midnight mb-2">When you select an industry, your templates will:</h4>
            <ul className="text-sm text-slate space-y-1">
              <li>✓ Include specific metrics and KPIs</li>
              <li>✓ Reference industry trends and challenges</li>
              <li>✓ Use relevant terminology and examples</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
