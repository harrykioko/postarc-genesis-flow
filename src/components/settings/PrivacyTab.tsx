
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const PrivacyTab = () => {
  return (
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
  );
};
