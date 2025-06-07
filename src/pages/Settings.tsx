
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Link, Shield, CreditCard } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { ConnectionsTab } from "@/components/settings/ConnectionsTab";
import { AccountTab } from "@/components/settings/AccountTab";
import { PrivacyTab } from "@/components/settings/PrivacyTab";

const Settings = () => {
  const { loading: profileLoading } = useUserProfile();

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
            <RouterLink to="/dashboard" className="flex items-center space-x-2 text-slate hover:text-midnight transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </RouterLink>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/4c54b1f5-c3f4-4d70-9a61-eca611f2e011.png" 
                alt="PostArc Logo" 
                className="h-8 w-auto object-contain"
              />
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
            <p className="text-slate">Manage your profile, connections, and account settings</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
              <TabsTrigger value="profile" className="flex items-center space-x-2 data-[state=active]:bg-neon/10 data-[state=active]:text-midnight">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="connections" className="flex items-center space-x-2 data-[state=active]:bg-neon/10 data-[state=active]:text-midnight">
                <Link className="w-4 h-4" />
                <span>Connections</span>
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
              <ProfileTab />
            </TabsContent>

            <TabsContent value="connections">
              <ConnectionsTab />
            </TabsContent>

            <TabsContent value="account">
              <AccountTab />
            </TabsContent>

            <TabsContent value="privacy">
              <PrivacyTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
