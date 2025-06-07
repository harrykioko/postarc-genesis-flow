
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PostInputSectionProps {
  input: string;
  setInput: (value: string) => void;
}

export const PostInputSection = ({ input, setInput }: PostInputSectionProps) => {
  return (
    <div>
      <Label htmlFor="post-input" className="text-base font-semibold">
        Enter a topic or paste a URL
      </Label>
      <Input
        id="post-input"
        placeholder="e.g., 'AI in professional services' or paste an article URL"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="mt-2 border-slate/20 focus:ring-mint/40"
        aria-label="Post topic input"
      />
    </div>
  );
};
