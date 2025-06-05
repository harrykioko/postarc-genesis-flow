import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, Settings as SettingsIcon, Shield, CreditCard, Linkedin, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile, loading: profileLoading, refreshProfile } = useUserProfile();
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    job_title: "",
    linkedin_head: "",
    brand_voice: ""
  });
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Other settings state
  const [preferences, setPreferences] = useState({
    defaultTemplate: "consultant",
    useEmojis: true,
    useHashtags: true,
    contentTone: "professional"
  });

  const [accountSettings, setAccountSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    weeklyDigest: true
  });

  // LinkedIn connection state
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [linkedinProfile, setLinkedinProfile] = useState({
    name: "",
    profileUrl: "",
    profileImage: "",
    connectedAt: ""
  });

  // Load profile data when it becomes available
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

  const brandVoiceOptions = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "thought_leader", label: "Thought Leader" },
    { value: "industry_expert", label: "Industry Expert" }
  ];

  const templates = [
    { id: "consultant", name: "Consultant", description: "Professional and authoritative tone", color: "bg-blue-500" },
    { id: "founder", name: "Founder", description: "Entrepreneurial and visionary", color: "bg-purple-500" },
    { id: "vc", name: "VC", description: "Investment-focused insights", color: "bg-green-500" },
    { id: "sales", name: "Sales", description: "Engaging and relationship-focused", color: "bg-orange-500" },
    { id: "hr", name: "HR", description: "People and culture focused", color: "bg-pink-500" },
  ];

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
      
      // Refresh the profile data
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

  const handlePreferencesSave = () => {
    toast({
      title: "Preferences updated",
      description: "Your content preferences have been saved successfully.",
    });
  };

  const handleAccountSave = () => {
    toast({
      title: "Account settings updated",
      description: "Your account settings have been saved successfully.",
    });
  };

  const handleLinkedinConnect = () => {
    // Simulate LinkedIn OAuth connection
    setLinkedinConnected(true);
    setLinkedinProfile({
      name: "John Doe",
      profileUrl: "https://linkedin.com/in/johndoe",
      profileImage: "/placeholder.svg",
      connectedAt: new Date().toLocaleDateString()
    });
    toast({
      title: "LinkedIn connected",
      description: "Your LinkedIn account has been successfully connected.",
    });
  };

  const handleLinkedinDisconnect = () => {
    setLinkedinConnected(false);
    setLinkedinProfile({
      name: "",
      profileUrl: "",
      profileImage: "",
      connectedAt: ""
    });
    toast({
      title: "LinkedIn disconnected",
      description: "Your LinkedIn account has been disconnected.",
    });
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5FAFF] via-[#ECF6FF] to-[#FFFFFF] animate-[bgMove_15s_linear_infinite] bg-[length:100%_200%] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neon/30 border-t-neon rounded-full animate-spin mx-auto mb-4" />
          <p className="text-midnight">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5FAFF] via-[#ECF6FF] to-[#FFFFFF] animate-[bgMove_15s_linear_infinite] bg-[length:100%_200%]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2 text-slate hover:text-midnight transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-midnight to-neon rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-2xl font-heading font-bold text-midnight">PostArc</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-neon text-midnight">
              Settings
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-midnight mb-2">Account Settings</h1>
            <p className="text-slate">Manage your profile, preferences, and account settings</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
              <TabsTrigger value="profile" className="flex items-center space-x-2 data-[state=active]:bg-neon/10 data-[state=active]:text-midnight">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2 data-[state=active]:bg-neon/10 data-[state=active]:text-midnight">
                <SettingsIcon className="w-4 h-4" />
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center space-x-2 data-[state=active]:bg-neon/10 data-[state=active]:text-midnight">
                <CreditCard className="w-4 h-4" />
                <span>Account</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center space-x-2 data-[state=active]:bg-neon/10 data-[state=active]:text-midnight">
                <Shield className="w-4 h-4" />
                <span>Privacy</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
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
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="bg-white border-slate/10 rounded-xl shadow-sm hover:shadow-md hover:ring-1 hover:ring-neon/10 transition-all duration-200">
                <CardHeader>
                  <CardTitle className="font-heading text-midnight">Content Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Default Content Style</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => setPreferences({...preferences, defaultTemplate: template.id})}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                            preferences.defaultTemplate === template.id
                              ? 'border-neon bg-neon/5 shadow-lg border-l-4'
                              : 'border-slate/20 hover:border-neon/50'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full ${template.color} mb-2`} />
                          <div className="font-semibold text-midnight text-sm">{template.name}</div>
                          <div className="text-xs text-slate">{template.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-midnight">Default Content Elements</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="default-emojis">Include emojis by default</Label>
                        <p className="text-sm text-slate">Add relevant emojis to your posts automatically</p>
                      </div>
                      <Switch
                        id="default-emojis"
                        checked={preferences.useEmojis}
                        onCheckedChange={(checked) => setPreferences({...preferences, useEmojis: checked})}
                        className="data-[state=checked]:bg-neon"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="default-hashtags">Include hashtags by default</Label>
                        <p className="text-sm text-slate">Add relevant hashtags to your posts automatically</p>
                      </div>
                      <Switch
                        id="default-hashtags"
                        checked={preferences.useHashtags}
                        onCheckedChange={(checked) => setPreferences({...preferences, useHashtags: checked})}
                        className="data-[state=checked]:bg-neon"
                      />
                    </div>
                  </div>

                  <Button onClick={handlePreferencesSave} className="bg-neon text-midnight hover:bg-neon/90 font-semibold transition-all duration-200">
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <div className="space-y-6">
                <Card className="bg-white border-slate/10 rounded-xl shadow-sm hover:shadow-md hover:ring-1 hover:ring-neon/10 transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="font-heading text-midnight">Current Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-midnight">Free Plan</h3>
                        <p className="text-slate">5 posts per month</p>
                      </div>
                      <Button variant="outline" className="border-midnight text-midnight hover:bg-neon hover:text-midnight hover:border-neon">
                        Upgrade to Pro
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate/10 rounded-xl shadow-sm hover:shadow-md hover:ring-1 hover:ring-neon/10 transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="font-heading text-midnight flex items-center space-x-2">
                      <Linkedin className="w-5 h-5" />
                      <span>LinkedIn Integration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!linkedinConnected ? (
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-slate mt-0.5" />
                          <div>
                            <p className="text-slate text-sm">
                              Connect your LinkedIn account to automatically populate your profile information and enable seamless post sharing.
                            </p>
                          </div>
                        </div>
                        <Button 
                          onClick={handleLinkedinConnect}
                          className="bg-[#0077B5] text-white hover:bg-[#0077B5]/90 flex items-center space-x-2"
                        >
                          <Linkedin className="w-4 h-4" />
                          <span>Connect LinkedIn Account</span>
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                              <div className="flex items-center space-x-2">
                                <img 
                                  src={linkedinProfile.profileImage} 
                                  alt="Profile" 
                                  className="w-8 h-8 rounded-full"
                                />
                                <div>
                                  <p className="font-semibold text-green-800">{linkedinProfile.name}</p>
                                  <p className="text-xs text-green-600">Connected on {linkedinProfile.connectedAt}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                              onClick={() => window.open(linkedinProfile.profileUrl, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View Profile
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-midnight">Account Connected</p>
                            <p className="text-xs text-slate">Your LinkedIn account is successfully connected</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLinkedinDisconnect}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate/10 rounded-xl shadow-sm hover:shadow-md hover:ring-1 hover:ring-neon/10 transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="font-heading text-midnight">Email Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email notifications</Label>
                        <p className="text-sm text-slate">Receive important account updates</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={accountSettings.emailNotifications}
                        onCheckedChange={(checked) => setAccountSettings({...accountSettings, emailNotifications: checked})}
                        className="data-[state=checked]:bg-neon"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing-emails">Marketing emails</Label>
                        <p className="text-sm text-slate">Receive product updates and tips</p>
                      </div>
                      <Switch
                        id="marketing-emails"
                        checked={accountSettings.marketingEmails}
                        onCheckedChange={(checked) => setAccountSettings({...accountSettings, marketingEmails: checked})}
                        className="data-[state=checked]:bg-neon"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-digest">Weekly digest</Label>
                        <p className="text-sm text-slate">Get a summary of your content performance</p>
                      </div>
                      <Switch
                        id="weekly-digest"
                        checked={accountSettings.weeklyDigest}
                        onCheckedChange={(checked) => setAccountSettings({...accountSettings, weeklyDigest: checked})}
                        className="data-[state=checked]:bg-neon"
                      />
                    </div>

                    <Button onClick={handleAccountSave} className="bg-neon text-midnight hover:bg-neon/90 font-semibold transition-all duration-200">
                      Save Account Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="privacy">
              <Card className="bg-white border-slate/10 rounded-xl shadow-sm hover:shadow-md hover:ring-1 hover:ring-neon/10 transition-all duration-200">
                <CardHeader>
                  <CardTitle className="font-heading text-midnight">Privacy & Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-midnight mb-2">Export Your Data</h3>
                      <p className="text-slate text-sm mb-4">Download a copy of all your data including posts, settings, and usage history.</p>
                      <Button variant="outline" className="border-midnight text-midnight hover:bg-neon hover:text-midnight hover:border-neon">
                        Export My Data
                      </Button>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
                      <p className="text-slate text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                      <Button variant="destructive">Delete My Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
