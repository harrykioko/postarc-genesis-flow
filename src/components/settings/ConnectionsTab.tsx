
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Linkedin, Twitter, Facebook, Zap, Calendar, BarChart3, Link as LinkIcon } from "lucide-react";
import { LinkedInIntegration } from "./LinkedInIntegration";

export const ConnectionsTab = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <Card className="bg-white border-slate/10 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-midnight flex items-center space-x-3">
            <LinkIcon className="w-6 h-6 text-neon" />
            <span>Connections</span>
          </CardTitle>
          <p className="text-slate">
            Manage your social accounts and integrations to enhance your PostArc experience
          </p>
        </CardHeader>
      </Card>

      {/* Social Accounts Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">📱</span>
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-midnight">Social Accounts</h2>
            <p className="text-slate text-sm">Connect your social media accounts to enable direct posting and analytics</p>
          </div>
        </div>

        {/* LinkedIn Integration */}
        <LinkedInIntegration />

        {/* Twitter Placeholder */}
        <Card className="bg-white border-slate/10 rounded-xl shadow-sm opacity-75">
          <CardHeader>
            <CardTitle className="font-heading text-midnight flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Twitter className="w-5 h-5 text-blue-400" />
                <span>Twitter</span>
              </div>
              <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50">
                Coming Soon
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-slate/70">
                <div className="w-2 h-2 rounded-full bg-slate/30" />
                <span className="text-sm">Cross-post to Twitter automatically</span>
              </div>
              <div className="flex items-center space-x-2 text-slate/70">
                <div className="w-2 h-2 rounded-full bg-slate/30" />
                <span className="text-sm">Thread creation from long posts</span>
              </div>
              <div className="flex items-center space-x-2 text-slate/70">
                <div className="w-2 h-2 rounded-full bg-slate/30" />
                <span className="text-sm">Twitter engagement tracking</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Status: Coming in Q2 2025</p>
            </div>
          </CardContent>
        </Card>

        {/* Facebook Placeholder */}
        <Card className="bg-white border-slate/10 rounded-xl shadow-sm opacity-75">
          <CardHeader>
            <CardTitle className="font-heading text-midnight flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Facebook className="w-5 h-5 text-blue-600" />
                <span>Facebook Pages</span>
              </div>
              <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50">
                Coming Soon
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-slate/70">
                <div className="w-2 h-2 rounded-full bg-slate/30" />
                <span className="text-sm">Post to Facebook business pages</span>
              </div>
              <div className="flex items-center space-x-2 text-slate/70">
                <div className="w-2 h-2 rounded-full bg-slate/30" />
                <span className="text-sm">Professional content adaptation</span>
              </div>
              <div className="flex items-center space-x-2 text-slate/70">
                <div className="w-2 h-2 rounded-full bg-slate/30" />
                <span className="text-sm">Facebook insights integration</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Status: Coming in Q3 2025</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Future Integrations Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🔌</span>
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-midnight">Integrations</h2>
            <p className="text-slate text-sm">Connect with productivity tools and automation platforms</p>
            <Badge variant="outline" className="border-purple-200 text-purple-600 bg-purple-50 mt-1">
              Coming Soon
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Zapier */}
          <Card className="bg-white border-slate/10 rounded-xl shadow-sm opacity-60">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Zap className="w-6 h-6 text-orange-500" />
                <span className="font-semibold text-midnight">Zapier</span>
              </div>
              <p className="text-sm text-slate/70 mb-3">
                Automate workflows with 5,000+ apps
              </p>
              <Badge variant="outline" className="border-slate/30 text-slate/60">
                Planned
              </Badge>
            </CardContent>
          </Card>

          {/* Buffer */}
          <Card className="bg-white border-slate/10 rounded-xl shadow-sm opacity-60">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Calendar className="w-6 h-6 text-blue-500" />
                <span className="font-semibold text-midnight">Buffer</span>
              </div>
              <p className="text-sm text-slate/70 mb-3">
                Advanced scheduling and queue management
              </p>
              <Badge variant="outline" className="border-slate/30 text-slate/60">
                Planned
              </Badge>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="bg-white border-slate/10 rounded-xl shadow-sm opacity-60">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <BarChart3 className="w-6 h-6 text-green-500" />
                <span className="font-semibold text-midnight">Analytics Suite</span>
              </div>
              <p className="text-sm text-slate/70 mb-3">
                Advanced performance tracking and insights
              </p>
              <Badge variant="outline" className="border-slate/30 text-slate/60">
                Planned
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-800">
            <strong>Coming 2025:</strong> We're building a comprehensive integration ecosystem. 
            Stay tuned for updates on Zapier automation, Buffer scheduling, and advanced analytics tools.
          </p>
        </div>
      </div>
    </div>
  );
};
