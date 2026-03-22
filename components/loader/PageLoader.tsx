"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 600);
    const removeTimer = setTimeout(() => setGone(true), 1100);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500"
      style={{ opacity: fading ? 0 : 1, pointerEvents: "none" }}
    >
      <div className="loader-in flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/imgs/logo-dark-green.svg"
          alt="Mantra Animal"
          width={220}
          height={63}
          className="logo-pulse"
          style={{ maxWidth: "60vw", height: "auto" }}
        />
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-primary-light"
              style={{ animation: `logoPulse 1.2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
