'use client';

import { useEffect, useState } from 'react';

export default function MouseTracker() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 text-retro-text text-xs font-mono bg-retro-bg/80 border border-retro-border px-3 py-2 glow-retro">
      <div>X: {mousePos.x}</div>
      <div>Y: {mousePos.y}</div>
    </div>
  );
}

