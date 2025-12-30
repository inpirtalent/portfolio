'use client';

import { useEffect, useState } from 'react';

const codeSnippets = [
  'const portfolio = { name: "Juliano", skills: ["Next.js", "Node.js", "Ruby on Rails"] };',
  'function buildProject() { return "Full-stack magic"; }',
  'const automation = async () => { await integrate("Airtable", "Make.com"); };',
  'const marketing = { strategy: "data-driven", tools: ["analytics", "automation"] };',
  'class Developer { constructor() { this.passion = "coding"; } }',
];

export default function TypingEffect() {
  const [currentText, setCurrentText] = useState('');
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentSnippet = codeSnippets[snippetIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentSnippet.length) {
          setCurrentText(currentSnippet.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (charIndex > 0) {
          setCurrentText(currentSnippet.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setSnippetIndex((snippetIndex + 1) % codeSnippets.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, snippetIndex]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] opacity-10">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-8">
        <pre className="text-retro-text text-sm md:text-base lg:text-lg font-mono whitespace-pre-wrap break-words">
          {currentText}
          <span className="animate-blink">|</span>
        </pre>
      </div>
    </div>
  );
}

