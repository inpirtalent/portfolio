import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  category: string;
}

export default function ProjectCard({ title, description, technologies, image, category }: ProjectCardProps) {
  return (
    <div className="border border-retro-border p-4 hover:glow-retro transition-all duration-300 bg-retro-bg/50 backdrop-blur-sm">
      <div className="relative w-full h-48 mb-4 border border-retro-border">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 bg-retro-bg border border-retro-accent px-2 py-1 text-xs text-retro-accent">
          {category}
        </div>
      </div>
      <h3 className="text-retro-text text-xl mb-2 text-shadow-retro">{title}</h3>
      <p className="text-retro-text text-sm mb-3">{description}</p>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, idx) => (
          <span
            key={idx}
            className="border border-retro-border px-2 py-1 text-xs text-retro-accent"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

