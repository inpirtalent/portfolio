'use client';

import { useEffect, useState } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
  delay?: number;
}

export default function TypingText({ text, speed = 30, className = '', delay = 0 }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Calculate variable typing speed for more realistic effect
  const getTypingSpeed = (char: string, index: number) => {
    // Pause longer at punctuation
    if (char === '.' || char === '!' || char === '?') {
      return speed * 8; // Longer pause at sentence end
    }
    if (char === ',' || char === ';' || char === ':') {
      return speed * 4; // Medium pause at comma
    }
    if (char === ' ') {
      return speed * 1.5; // Slight pause at spaces
    }
    // Variable speed for regular characters (simulates human typing)
    const baseSpeed = speed;
    const variation = Math.random() * 0.4 + 0.8; // 80-120% of base speed
    return baseSpeed * variation;
  };

  useEffect(() => {
    if (delay > 0 && !hasStarted) {
      const delayTimeout = setTimeout(() => {
        setHasStarted(true);
      }, delay);
      return () => clearTimeout(delayTimeout);
    }

    if (hasStarted && currentIndex < text.length) {
      const currentChar = text[currentIndex];
      const typingSpeed = getTypingSpeed(currentChar, currentIndex);
      
      const timeout = setTimeout(() => {
        setDisplayedText(text.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else if (hasStarted && currentIndex >= text.length) {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed, delay, hasStarted]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && hasStarted && <span className="animate-blink">|</span>}
    </span>
  );
}
