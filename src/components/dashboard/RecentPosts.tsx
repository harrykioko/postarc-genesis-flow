
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, ClipboardCopy } from "lucide-react";

interface Post {
  id: number;
  preview: string;
  date: string;
}

interface RecentPostsProps {
  recentPosts: Post[];
  onCopy: (text: string) => void;
}

export const RecentPosts = ({ recentPosts, onCopy }: RecentPostsProps) => {
  return (
    <Card className="bg-white border-0 rounded-xl shadow-lg hover:ring-1 hover:ring-mint/10 transition-all duration-200">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-neon" />
          <CardTitle className="font-heading text-midnight">Recent Posts</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentPosts.map((post, index) => (
          <div 
            key={post.id} 
            className={`group relative p-3 bg-slate/5 rounded-lg transition-all duration-200 hover:bg-slate/10 hover:shadow-md cursor-pointer ${
              index === 0 ? 'animate-slide-in-item' : ''
            }`}
            onClick={() => onCopy(post.preview)}
            role="button"
            tabIndex={0}
            aria-label={`Copy post: ${post.preview}`}
          >
            <div className="text-sm text-midnight mb-1 pr-8">{post.preview}</div>
            <div className="text-xs text-slate">{post.date}</div>
            <ClipboardCopy className="absolute top-3 right-3 w-4 h-4 text-slate opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        ))}
        <Button variant="outline" className="w-full mt-3 border-midnight hover:bg-mint hover:text-midnight">
          View All History
        </Button>
      </CardContent>
    </Card>
  );
};
