interface SkillsSectionProps {
  title: string;
  items: string[];
  color: 'green' | 'cyan' | 'yellow' | 'magenta' | 'orange';
}

function SkillsSection({ title, items, color }: SkillsSectionProps) {
  const colorClasses = {
    green: 'border-retro-border text-retro-text',
    cyan: 'border-retro-border text-retro-text',
    yellow: 'border-retro-accent text-retro-accent',
    magenta: 'border-retro-border text-retro-text',
    orange: 'border-retro-muted text-retro-muted',
  };

  const textColorClass = colorClasses[color].split(' ')[1];

  return (
    <div>
      <h3 className={`text-xl md:text-2xl mb-4 text-shadow-retro ${textColorClass}`}>
        &gt; {title}
      </h3>
      <div className="flex flex-wrap gap-3">
        {items.map((item, idx) => (
          <span
            key={idx}
            className={`border px-4 py-2 text-sm md:text-base ${colorClasses[color]} hover:glow-retro transition-all`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default SkillsSection;

