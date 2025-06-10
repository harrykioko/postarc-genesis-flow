
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DemoInputSectionProps {
  input: string;
  onInputChange: (value: string) => void;
}

export const DemoInputSection = ({ input, onInputChange }: DemoInputSectionProps) => {
  return (
    <div>
      <Label htmlFor="demo-input" className="text-base font-semibold">
        Enter a topic or paste a URL
      </Label>
      <Input
        id="demo-input"
        placeholder="e.g., 'AI in professional services' or paste an article URL"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        className="mt-2 p-4 text-lg border-2 border-gray-200 focus:border-neon focus:shadow-[0_0_15px_rgba(0,255,194,0.2)] transition-all duration-200"
      />
      {input.startsWith('http') && (
        <p className="text-xs text-slate mt-1">
          🔗 We'll analyze this article and create a LinkedIn post about it
        </p>
      )}
    </div>
  );
};
