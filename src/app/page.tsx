"use client";

import React, { useState, useEffect } from "react";

const RefinedCosmicText = () => {
  const text = "Refined Cosmic Text";
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black">
      {/* Background: Subtle circular glowing gradient */}
      <div className="bg-gradient-radial absolute inset-0 z-0 from-transparent to-[#FF00FF] opacity-20 blur-3xl">
        {/* Circular glowing effect */}
        <div className="bg-gradient-radial absolute inset-0 from-transparent to-[#7A00FF] opacity-40 blur-2xl"></div>
      </div>

      {/* Text with cosmic glow effect */}
      <div
        className="relative z-10 font-serif text-6xl font-extrabold tracking-tight text-transparent sm:text-8xl"
        style={{
          background: `linear-gradient(45deg, #ff1493, #8b00ff)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          animation: "lightFlow 12s ease-in-out infinite",
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
        }}
      >
        {text}
      </div>

      {/* Subtle glowing aura effect around the text */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full"
        style={{
          transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03}px)`,
        }}
      >
        <div className="animate-glow-pulse h-full w-full bg-gradient-to-r from-[#ff7f50] to-[#8b00ff] opacity-15 blur-xl"></div>
      </div>
    </div>
  );
};

export default RefinedCosmicText;
