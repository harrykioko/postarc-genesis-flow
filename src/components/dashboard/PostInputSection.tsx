
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PostInputSectionProps {
  input: string;
  setInput: (value: string) => void;
}

export const PostInputSection = ({ input, setInput }: PostInputSectionProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="post-input" className="text-lg font-semibold text-midnight">
        What would you like to write about?
      </Label>
      <Input
        id="post-input"
        placeholder="Enter a topic like 'AI in professional services' or paste an article URL..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-14 text-lg px-4 border-2 border-slate/20 focus:border-mint focus:ring-mint/40 bg-white/90 placeholder:text-slate/50"
        aria-label="Post topic input"
      />
    </div>
  );
};
