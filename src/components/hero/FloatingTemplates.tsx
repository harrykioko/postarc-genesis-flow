
export const FloatingTemplates = () => {
  const templates = [
    { name: "Consultant", x: "10%", y: "20%", delay: "0s" },
    { name: "Founder", x: "85%", y: "15%", delay: "1s" },
    { name: "VC", x: "15%", y: "70%", delay: "2s" },
    { name: "Sales", x: "80%", y: "75%", delay: "0.5s" },
    { name: "HR", x: "60%", y: "25%", delay: "1.5s" }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {templates.map((template, index) => (
        <div
          key={index}
          className="absolute opacity-5 animate-[float_6s_ease-in-out_infinite] hidden lg:block"
          style={{
            left: template.x,
            top: template.y,
            animationDelay: template.delay
          }}
        >
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2">
            <span className="text-midnight font-medium">{template.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
