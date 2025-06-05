
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Linkedin, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LinkedInIntegration = () => {
  const { toast } = useToast();
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [linkedinProfile, setLinkedinProfile] = useState({
    name: "",
    profileUrl: "",
    profileImage: "",
    connectedAt: ""
  });

  const handleLinkedinConnect = () => {
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

  return (
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
  );
};
