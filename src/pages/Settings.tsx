
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Settings, Shield, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "John Doe",
    title: "Senior Consultant",
    company: "Tech Solutions Inc.",
    headline: "Helping businesses transform through technology",
    brandVoice: "Professional yet approachable, data-driven insights with actionable takeaways",
    linkedinUrl: ""
  });

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

  const templates = [
    { id: "consultant", name: "Consultant", description: "Professional and authoritative tone", color: "bg-blue-500" },
    { id: "founder", name: "Founder", description: "Entrepreneurial and visionary", color: "bg-purple-500" },
    { id: "vc", name: "VC", description: "Investment-focused insights", color: "bg-green-500" },
    { id: "sales", name: "Sales", description: "Engaging and relationship-focused", color: "bg-orange-500" },
    { id: "hr", name: "HR", description: "People and culture focused", color: "bg-pink-500" },
  ];

  const handleProfileSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile settings have been saved successfully.",
    });
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

  return (
    <div className="min-h-screen bg-gradient-brand">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Account</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Privacy</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="font-heading text-midnight">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        value={profile.title}
                        onChange={(e) => setProfile({...profile, title: e.target.value})}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profile.company}
                        onChange={(e) => setProfile({...profile, company: e.target.value})}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn URL (Optional)</Label>
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={profile.linkedinUrl}
                        onChange={(e) => setProfile({...profile, linkedinUrl: e.target.value})}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="headline">Professional Headline</Label>
                    <Input
                      id="headline"
                      placeholder="Brief description of what you do"
                      value={profile.headline}
                      onChange={(e) => setProfile({...profile, headline: e.target.value})}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="brandVoice">Brand Voice & Style</Label>
                    <Textarea
                      id="brandVoice"
                      placeholder="Describe your preferred writing style, tone, and voice for generated content..."
                      value={profile.brandVoice}
                      onChange={(e) => setProfile({...profile, brandVoice: e.target.value})}
                      className="mt-2 min-h-[100px]"
                    />
                  </div>

                  <Button onClick={handleProfileSave} className="btn-neon">
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="glass-card border-0">
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
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                            preferences.defaultTemplate === template.id
                              ? 'border-neon bg-gradient-to-br from-neon/10 to-neon/5 shadow-[0_0_20px_rgba(0,255,194,0.3)]'
                              : 'border-gray-200 hover:border-neon/50 hover:shadow-md'
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
                      />
                    </div>
                  </div>

                  <Button onClick={handlePreferencesSave} className="btn-neon">
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <div className="space-y-6">
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="font-heading text-midnight">Current Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-midnight">Free Plan</h3>
                        <p className="text-slate">5 posts per month</p>
                      </div>
                      <Button className="btn-neon">Upgrade to Pro</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-0">
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
                      />
                    </div>

                    <Button onClick={handleAccountSave} className="btn-neon">
                      Save Account Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="privacy">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="font-heading text-midnight">Privacy & Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-midnight mb-2">Export Your Data</h3>
                      <p className="text-slate text-sm mb-4">Download a copy of all your data including posts, settings, and usage history.</p>
                      <Button variant="outline">Export My Data</Button>
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
