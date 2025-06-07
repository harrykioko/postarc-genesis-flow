
interface TemplateToneStepProps {
  selectedTones: string[];
  onTonesChange: (tones: string[]) => void;
}

export const TemplateToneStep = ({ selectedTones, onTonesChange }: TemplateToneStepProps) => {
  const tones = [
    { id: "conversational", label: "🗣️ Conversational", description: "Approachable and friendly" },
    { id: "professional", label: "📈 Professional", description: "Polished and formal" },
    { id: "thoughtful", label: "💭 Thoughtful", description: "Reflective and insightful" },
    { id: "bold", label: "🔥 Bold & Confident", description: "Strong and decisive" },
    { id: "friendly", label: "😊 Friendly", description: "Warm and personable" },
    { id: "direct", label: "🎯 Direct", description: "Clear and straightforward" },
    { id: "educational", label: "📚 Educational", description: "Informative and instructional" },
    { id: "innovative", label: "💡 Innovative", description: "Forward-thinking and creative" },
    { id: "analytical", label: "🤔 Analytical", description: "Data-driven and logical" },
    { id: "playful", label: "😄 Playful", description: "Lighthearted and engaging" },
    { id: "energetic", label: "⚡ Energetic", description: "Dynamic and enthusiastic" },
    { id: "inspirational", label: "🏆 Inspirational", description: "Motivating and uplifting" }
  ];

  const toggleTone = (toneId: string) => {
    if (selectedTones.includes(toneId)) {
      onTonesChange(selectedTones.filter(id => id !== toneId));
    } else {
      onTonesChange([...selectedTones, toneId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-midnight mb-2">
          What tone fits your voice?
        </h3>
        <p className="text-slate">
          Select multiple tones that represent your communication style
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {tones.map((tone) => (
          <button
            key={tone.id}
            onClick={() => toggleTone(tone.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md ${
              selectedTones.includes(tone.id)
                ? 'border-neon bg-mint/10 shadow-md'
                : 'border-slate/20 hover:border-neon/50 bg-white/70'
            }`}
          >
            <div className="font-medium text-midnight mb-1">{tone.label}</div>
            <div className="text-sm text-slate">{tone.description}</div>
          </button>
        ))}
      </div>

      {selectedTones.length > 0 && (
        <div className="bg-mint/10 p-4 rounded-lg">
          <p className="text-sm text-midnight">
            <span className="font-medium">Selected tones:</span>{" "}
            {selectedTones.map(id => tones.find(t => t.id === id)?.label).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};
