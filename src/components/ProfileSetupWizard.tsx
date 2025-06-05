
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, User, Briefcase, MessageSquare, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileSetupWizardProps {
  onComplete: () => void;
}

export const ProfileSetupWizard = ({ onComplete }: ProfileSetupWizardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || user?.user_metadata?.full_name || '',
    job_title: '',
    linkedin_head: '',
    brand_voice: ''
  });

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const brandVoiceOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'thought_leader', label: 'Thought Leader' },
    { value: 'industry_expert', label: 'Industry Expert' }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceedFromStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '';
      case 2:
        return formData.job_title.trim() !== '';
      case 3:
        return formData.linkedin_head.trim() !== '';
      case 4:
        return formData.brand_voice !== '';
      default:
        return false;
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          job_title: formData.job_title,
          linkedin_head: formData.linkedin_head,
          brand_voice: formData.brand_voice,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile setup complete!",
        description: "Your profile has been saved successfully.",
      });

      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepIcons = [User, Briefcase, MessageSquare, Sparkles];
  const StepIcon = stepIcons[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-brand flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-neon/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <StepIcon className="w-8 h-8 text-neon" />
          </div>
          <CardTitle className="font-heading">Complete Your Profile</CardTitle>
          <CardDescription>
            Step {currentStep} of {totalSteps} - Let's personalize your experience
          </CardDescription>
          <Progress value={progressPercentage} className="mt-4" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What's your name?</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What's your job title?</h3>
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                  id="job_title"
                  value={formData.job_title}
                  onChange={(e) => handleInputChange('job_title', e.target.value)}
                  placeholder="e.g., Marketing Director, Software Engineer"
                  className="w-full"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What's your LinkedIn headline?</h3>
              <div className="space-y-2">
                <Label htmlFor="linkedin_head">LinkedIn Headline</Label>
                <Input
                  id="linkedin_head"
                  value={formData.linkedin_head}
                  onChange={(e) => handleInputChange('linkedin_head', e.target.value)}
                  placeholder="e.g., Helping companies scale through digital transformation"
                  className="w-full"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose your brand voice</h3>
              <div className="space-y-2">
                <Label htmlFor="brand_voice">Brand Voice</Label>
                <Select value={formData.brand_voice} onValueChange={(value) => handleInputChange('brand_voice', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandVoiceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!canProceedFromStep(currentStep)}
                className="flex items-center space-x-2 btn-neon"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceedFromStep(currentStep) || isSubmitting}
                className="btn-neon"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
