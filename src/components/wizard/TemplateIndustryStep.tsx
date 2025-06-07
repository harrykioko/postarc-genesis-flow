
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface TemplateIndustryStepProps {
  industryContext: string;
  onIndustryChange: (industry: string) => void;
}

export const TemplateIndustryStep = ({ industryContext, onIndustryChange }: TemplateIndustryStepProps) => {
  const popularIndustries = [
    "SaaS", "Real Estate", "Healthcare", "Finance", "Marketing", "HR",
    "Consulting", "EdTech", "E-commerce", "Manufacturing", "Legal", "Construction",
    "Technology", "Retail", "Media", "Education", "Non-profit", "Government"
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <h3 className="text-xl font-semibold text-midnight">
            Add industry context
          </h3>
          <Badge variant="secondary" className="text-xs">Optional</Badge>
        </div>
        <p className="text-slate">
          Help us understand your expertise to make templates more relevant
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
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

        {industryContext ? (
          <div className="bg-mint/10 p-4 rounded-lg">
            <h4 className="font-medium text-midnight mb-2">✨ Industry context added!</h4>
            <p className="text-sm text-slate mb-2">Your templates will now include:</p>
            <ul className="text-sm text-slate space-y-1">
              <li>✓ {industryContext}-specific metrics and KPIs</li>
              <li>✓ Relevant terminology and examples</li>
              <li>✓ Industry trends and challenges</li>
            </ul>
          </div>
        ) : (
          <div className="bg-slate/5 p-4 rounded-lg border border-dashed border-slate/20">
            <h4 className="font-medium text-slate mb-2">Skip this step?</h4>
            <p className="text-sm text-slate">
              No problem! You can create great templates without industry context. 
              You can always edit your template later to add this.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
