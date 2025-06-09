
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";

interface BusinessDetailsStepProps {
  companyName: string;
  companyDescription: string;
  companyIndustry: string;
  companyGoals: string;
  targetAudience: string;
  onCompanyNameChange: (value: string) => void;
  onCompanyDescriptionChange: (value: string) => void;
  onCompanyIndustryChange: (value: string) => void;
  onCompanyGoalsChange: (value: string) => void;
  onTargetAudienceChange: (value: string) => void;
}

export const BusinessDetailsStep = ({
  companyName,
  companyDescription,
  companyIndustry,
  companyGoals,
  targetAudience,
  onCompanyNameChange,
  onCompanyDescriptionChange,
  onCompanyIndustryChange,
  onCompanyGoalsChange,
  onTargetAudienceChange
}: BusinessDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-midnight">
            Tell us about your company
          </h3>
        </div>
        <p className="text-slate">
          Help us create content that represents your organization effectively
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Company Name - Required */}
        <div>
          <Label htmlFor="companyName" className="text-base font-medium flex items-center">
            Company Name
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="companyName"
            placeholder="Your company name"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            className={`mt-2 ${!companyName ? 'border-red-200 focus:border-red-300' : 'border-slate/20 focus:ring-mint/40'}`}
          />
          {!companyName && (
            <p className="text-sm text-red-500 mt-1">Company name is required</p>
          )}
        </div>

        {/* Company Description - Required */}
        <div>
          <Label htmlFor="companyDescription" className="text-base font-medium flex items-center">
            Company Description
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="companyDescription"
            placeholder="Brief description of what your company does..."
            value={companyDescription}
            onChange={(e) => onCompanyDescriptionChange(e.target.value)}
            className={`mt-2 min-h-[100px] ${!companyDescription ? 'border-red-200 focus:border-red-300' : 'border-slate/20 focus:ring-mint/40'}`}
          />
          {!companyDescription && (
            <p className="text-sm text-red-500 mt-1">Company description is required</p>
          )}
        </div>

        {/* Company Industry - Optional */}
        <div>
          <Label htmlFor="companyIndustry" className="text-base font-medium">
            Industry
          </Label>
          <Input
            id="companyIndustry"
            placeholder="e.g., Technology, Healthcare, Finance"
            value={companyIndustry}
            onChange={(e) => onCompanyIndustryChange(e.target.value)}
            className="mt-2 border-slate/20 focus:ring-mint/40"
          />
        </div>

        {/* Company Goals - Optional */}
        <div>
          <Label htmlFor="companyGoals" className="text-base font-medium">
            Company Goals
          </Label>
          <Textarea
            id="companyGoals"
            placeholder="What are the company's main objectives? e.g., Drive brand awareness, Generate leads, Establish thought leadership"
            value={companyGoals}
            onChange={(e) => onCompanyGoalsChange(e.target.value)}
            className="mt-2 min-h-[80px] border-slate/20 focus:ring-mint/40"
          />
        </div>

        {/* Target Audience - Optional */}
        <div>
          <Label htmlFor="targetAudience" className="text-base font-medium">
            Target Audience
          </Label>
          <Input
            id="targetAudience"
            placeholder="Who does the company serve? e.g., Small business owners, Enterprise clients"
            value={targetAudience}
            onChange={(e) => onTargetAudienceChange(e.target.value)}
            className="mt-2 border-slate/20 focus:ring-mint/40"
          />
        </div>

        {/* Validation Feedback */}
        {companyName && companyDescription && (
          <div className="bg-mint/10 p-4 rounded-lg">
            <h4 className="font-medium text-midnight mb-2">✨ Company details added!</h4>
            <p className="text-sm text-slate">
              Your templates will now be tailored for <span className="font-medium">{companyName}</span> and include company-specific messaging.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
