
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuotaCardProps {
  quota: { used: number; total: number };
}

export const QuotaCard = ({ quota }: QuotaCardProps) => {
  return (
    <Card className="bg-white border-0 rounded-xl shadow-lg hover:ring-1 hover:ring-mint/10 transition-all duration-200">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-midnight mb-2">
            {quota.total - quota.used} / {quota.total}
          </div>
          <div className="text-slate mb-4 font-medium">{quota.used} / {quota.total} posts used this month</div>
          <div className="w-full bg-slate/20 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className="bg-neon h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((quota.total - quota.used) / quota.total) * 100}%` }}
            />
          </div>
          {quota.used >= quota.total && (
            <Button className="bg-neon text-midnight hover:bg-neon/90 w-full">
              Upgrade to Pro
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
