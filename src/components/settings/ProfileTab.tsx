
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const brandVoiceOptions = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "thought_leader", label: "Thought Leader" },
  { value: "industry_expert", label: "Industry Expert" }
];

export const ProfileTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile, refreshProfile } = useUserProfile();
  
  const [profileForm, setProfileForm] = useState({
    name: "",
    job_title: "",
    linkedin_head: "",
    brand_voice: ""
  });
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || "",
        job_title: profile.job_title || "",
        linkedin_head: profile.linkedin_head || "",
        brand_voice: profile.brand_voice || ""
      });
    }
  }, [profile]);

  const handleProfileSave = async () => {
    if (!user) return;

    setIsProfileSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: profileForm.name,
          job_title: profileForm.job_title,
          linkedin_head: profileForm.linkedin_head,
          brand_voice: profileForm.brand_voice,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile settings have been saved successfully.",
      });
      
      refreshProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProfileSaving(false);
    }
  };

  return (
    <Card className="bg-white border-slate/10 rounded-xl shadow-sm hover:shadow-md hover:ring-1 hover:ring-neon/10 transition-all duration-200">
      <CardHeader>
        <CardTitle className="font-heading text-midnight">Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profileForm.name}
              onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
              className="mt-2 border-slate/20 focus:ring-neon/40"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={user?.email || ""}
              readOnly
              className="mt-2 border-slate/20 bg-gray-50 text-gray-600"
              placeholder="Your email address"
            />
            <p className="text-xs text-slate mt-1">Email cannot be changed here</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="job_title">Professional Title</Label>
            <Input
              id="job_title"
              value={profileForm.job_title}
              onChange={(e) => setProfileForm({...profileForm, job_title: e.target.value})}
              className="mt-2 border-slate/20 focus:ring-neon/40"
              placeholder="e.g., Marketing Director, Software Engineer"
            />
          </div>
          <div>
            <Label htmlFor="brand_voice">Brand Voice</Label>
            <Select 
              value={profileForm.brand_voice} 
              onValueChange={(value) => setProfileForm({...profileForm, brand_voice: value})}
            >
              <SelectTrigger className="mt-2 border-slate/20 focus:ring-neon/40">
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

        <div>
          <Label htmlFor="linkedin_head">LinkedIn Headline</Label>
          <Input
            id="linkedin_head"
            placeholder="e.g., Helping companies scale through digital transformation"
            value={profileForm.linkedin_head}
            onChange={(e) => setProfileForm({...profileForm, linkedin_head: e.target.value})}
            className="mt-2 border-slate/20 focus:ring-neon/40"
          />
        </div>

        <Button 
          onClick={handleProfileSave} 
          disabled={isProfileSaving}
          className="bg-neon text-midnight hover:bg-neon/90 font-semibold transition-all duration-200"
        >
          {isProfileSaving ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            'Save Profile'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
