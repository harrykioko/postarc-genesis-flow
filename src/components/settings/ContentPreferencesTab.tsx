
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const templates = [
  { id: "consultant", name: "Consultant", description: "Professional and authoritative tone", color: "bg-blue-500" },
  { id: "founder", name: "Founder", description: "Entrepreneurial and visionary", color: "bg-purple-500" },
  { id: "vc", name: "VC", description: "Investment-focused insights", color: "bg-green-500" },
  { id: "sales", name: "Sales", description: "Engaging and relationship-focused", color: "bg-orange-500" },
  { id: "hr", name: "HR", description: "People and culture focused", color: "bg-pink-500" },
];

export const ContentPreferencesTab = () => {
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState({
    defaultTemplate: "consultant",
    useEmojis: true,
    useHashtags: true,
    contentTone: "professional"
  });

  const handlePreferencesSave = () => {
    toast({
      title: "Preferences updated",
      description: "Your content preferences have been saved successfully.",
    });
  };

  return (
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
  );
};
