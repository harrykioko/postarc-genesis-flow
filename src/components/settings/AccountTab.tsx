
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { LinkedInIntegration } from "./LinkedInIntegration";

export const AccountTab = () => {
  const { toast } = useToast();
  
  const [accountSettings, setAccountSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    weeklyDigest: true
  });

  const handleAccountSave = () => {
    toast({
      title: "Account settings updated",
      description: "Your account settings have been saved successfully.",
    });
  };

  return (
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

      <LinkedInIntegration />

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
  );
};
