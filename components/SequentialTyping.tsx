'use client';

import { useEffect, useState } from 'react';
import TypingText from './TypingText';

interface SequentialTypingProps {
  paragraphs: string[];
  speed?: number;
  className?: string;
}

export default function SequentialTyping({ paragraphs, speed = 15, className = '' }: SequentialTypingProps) {
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [completedParagraphs, setCompletedParagraphs] = useState<number[]>([]);

  // Calculate delay for each paragraph based on previous paragraphs' length
  const calculateDelay = (index: number) => {
    if (index === 0) return 0;
    
    let totalDelay = 0;
    for (let i = 0; i < index; i++) {
      const paragraphLength = paragraphs[i].length;
      // Average typing time: length * speed + pause at end
      const typingTime = paragraphLength * speed;
      const pauseTime = 800; // Pause between paragraphs
      totalDelay += typingTime + pauseTime;
    }
    return totalDelay;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((text, index) => (
        <p key={index}>
          <TypingText 
            text={text}
            speed={speed}
            delay={calculateDelay(index)}
          />
        </p>
      ))}
    </div>
  );
}

