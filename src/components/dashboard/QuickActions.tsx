
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

export const QuickActions = () => {
  return (
    <Card className="bg-white border-0 rounded-xl shadow-lg hover:ring-1 hover:ring-mint/10 transition-all duration-200">
      <CardHeader>
        <CardTitle className="font-heading text-midnight">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link to="/settings">
          <div className="bg-slate/5 rounded-lg p-4 transition-all duration-200 hover:bg-slate/10 hover:shadow-md cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-neon/20 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-neon" />
              </div>
              <div>
                <div className="font-semibold text-midnight">Account Settings</div>
                <div className="text-xs text-slate">Manage your preferences</div>
              </div>
            </div>
          </div>
        </Link>
        <Link to="/settings">
          <div className="bg-slate/5 rounded-lg p-4 transition-all duration-200 hover:bg-slate/10 hover:shadow-md cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-neon/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-neon" />
              </div>
              <div>
                <div className="font-semibold text-midnight">Profile Setup</div>
                <div className="text-xs text-slate">Complete your profile</div>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};
